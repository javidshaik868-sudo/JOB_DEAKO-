import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Spinner';
import { PageHeader } from '../../components/common/Feedback';
import { DropdownSelect } from '../../components/common/DropdownSelect';
import { Icon } from '../../components/icons/Icon';
import { resumeApi } from '../../services/resumeApi';
import { useToast } from '../../context/ToastContext';

const createEmptyResume = () => ({
  documentTitle: 'Untitled Resume',
  documentHtml: '',
  documentPages: [''],
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
});

const allowedTags = new Set([
  'b', 'blockquote', 'br', 'div', 'em', 'font', 'h1', 'h2', 'h3', 'h4', 'i', 'li', 'ol', 'p', 's', 'span', 'strong', 'u', 'ul',
]);
const blockedTags = new Set(['iframe', 'object', 'script', 'style', 'svg', 'template']);
const allowedFonts = new Set(['Arial', 'Aptos', 'Calibri', 'Georgia', 'Times New Roman', 'Verdana']);
const fontFamilyOptions = ['Calibri', 'Arial', 'Aptos', 'Georgia', 'Times New Roman', 'Verdana']
  .map((font) => ({ value: font, label: font }));
const fontSizeOptions = [['2', '10'], ['3', '12'], ['4', '14'], ['5', '18'], ['6', '24']]
  .map(([value, label]) => ({ value, label }));
const paragraphStyleOptions = [
  { value: 'p', label: 'Normal' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
];
const legacyFontSizes = { 1: '8pt', 2: '10pt', 3: '12pt', 4: '14pt', 5: '18pt', 6: '24pt', 7: '36pt' };

const sanitizeResumeHtml = (html) => {
  const parsedDocument = new DOMParser().parseFromString(html || '', 'text/html');
  const cleanNode = (node) => {
    if (node.nodeType === 3) return document.createTextNode(node.nodeValue || '');
    if (node.nodeType !== 1 || blockedTags.has(node.tagName.toLowerCase())) return null;

    const tagName = node.tagName.toLowerCase();
    if (!allowedTags.has(tagName)) {
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => {
        const cleanChild = cleanNode(child);
        if (cleanChild) fragment.append(cleanChild);
      });
      return fragment;
    }

    const cleanElement = document.createElement(tagName === 'font' ? 'span' : tagName);
    const fontFamily = node.style?.fontFamily || node.getAttribute('face') || '';
    const normalizedFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    if (allowedFonts.has(normalizedFont)) cleanElement.style.fontFamily = normalizedFont;

    const color = node.style?.color || node.getAttribute('color') || '';
    if (/^#[\da-f]{3,8}$/i.test(color) || /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(color)) {
      cleanElement.style.color = color;
    }

    const fontSize = node.style?.fontSize || legacyFontSizes[node.getAttribute('size')] || '';
    if (/^\d+(?:\.\d+)?(?:pt|px)$/.test(fontSize)) cleanElement.style.fontSize = fontSize;

    const textAlign = node.style?.textAlign;
    if (['left', 'center', 'right', 'justify'].includes(textAlign)) cleanElement.style.textAlign = textAlign;

    const fontWeight = node.style?.fontWeight;
    if (fontWeight === 'bold' || /^[1-9]00$/.test(fontWeight)) cleanElement.style.fontWeight = fontWeight;

    if (node.style?.fontStyle === 'italic') cleanElement.style.fontStyle = 'italic';
    if (['underline', 'line-through'].includes(node.style?.textDecoration)) {
      cleanElement.style.textDecoration = node.style.textDecoration;
    }

    Array.from(node.childNodes).forEach((child) => {
      const cleanChild = cleanNode(child);
      if (cleanChild) cleanElement.append(cleanChild);
    });
    return cleanElement;
  };

  const container = document.createElement('div');
  Array.from(parsedDocument.body.childNodes).forEach((node) => {
    const cleanChild = cleanNode(node);
    if (cleanChild) container.append(cleanChild);
  });
  return container.innerHTML;
};

const countWords = (html) => {
  const text = new DOMParser().parseFromString(html || '', 'text/html').body.textContent.trim();
  return text ? text.split(/\s+/).length : 0;
};

const createLegacyDocument = (resume) => {
  const container = document.createElement('div');
  const appendText = (tagName, value, parent = container) => {
    if (!value) return;
    const element = document.createElement(tagName);
    element.textContent = value;
    parent.append(element);
  };
  const appendSection = (title, entries) => {
    const lines = entries.filter(Boolean);
    if (!lines.length) return;
    appendText('h2', title);
    lines.forEach((line) => appendText('p', line));
  };

  appendText('h1', resume.personalInfo?.fullName);
  appendText('p', [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
    resume.personalInfo?.website,
    resume.personalInfo?.linkedin,
  ].filter(Boolean).join(' | '));
  appendSection('Professional Summary', [resume.summary]);
  appendSection('Experience', (resume.experience || []).flatMap((item) => [
    [item.role, item.company, item.period].filter(Boolean).join(' | '),
    item.details,
  ]));
  appendSection('Education', (resume.education || []).map((item) => [
    item.degree,
    item.school,
    item.year,
  ].filter(Boolean).join(' | ')));
  appendSection('Skills', [(resume.skills || []).join(', ')]);
  return container.innerHTML;
};

export const ResumeBuilderPage = () => {
  const toast = useToast();
  const editorRef = useRef(null);
  const editorPagesRef = useRef([]);
  const selectionRef = useRef(null);
  const focusNewPageRef = useRef(null);
  const [resume, setResume] = useState(createEmptyResume);
  const [documentPages, setDocumentPages] = useState(['']);
  const [activePage, setActivePage] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [fontSize, setFontSize] = useState('3');
  const [fontColor, setFontColor] = useState('#1F2937');

  const { data: initialResume, isLoading } = useQuery({
    queryKey: ['resumeData'],
    queryFn: () => resumeApi.getResumeData(),
  });

  useEffect(() => {
    if (!initialResume) return;
    const loadedResume = {
      ...createEmptyResume(),
      ...initialResume,
      personalInfo: {
        ...createEmptyResume().personalInfo,
        ...initialResume.personalInfo,
      },
    };
    const savedHtml = typeof initialResume.documentHtml === 'string'
      ? sanitizeResumeHtml(initialResume.documentHtml)
      : '';
    const legacyHtml = savedHtml || sanitizeResumeHtml(createLegacyDocument(loadedResume));
    const loadedPages = Array.isArray(initialResume.documentPages) && initialResume.documentPages.length
      ? initialResume.documentPages.map(sanitizeResumeHtml)
      : [legacyHtml];
    loadedResume.documentHtml = loadedPages[0] || '';
    loadedResume.documentPages = loadedPages;
    setResume(loadedResume);
    setDocumentPages(loadedPages);
    setActivePage(0);
    setWordCount(loadedPages.reduce((total, page) => total + countWords(page), 0));
    setIsDirty(false);
    window.requestAnimationFrame(() => {
      loadedPages.forEach((page, index) => {
        if (editorPagesRef.current[index]) editorPagesRef.current[index].innerHTML = page;
      });
    });
  }, [initialResume]);

  useEffect(() => {
    if (focusNewPageRef.current === null) return;
    const pageIndex = focusNewPageRef.current;
    const editor = editorPagesRef.current[pageIndex];
    if (!editor) return;
    editorRef.current = editor;
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
    focusNewPageRef.current = null;
  }, [documentPages.length]);

  const saveMutation = useMutation({
    mutationFn: (data) => resumeApi.saveResumeData(data),
    onSuccess: () => {
      setIsDirty(false);
      toast.success('Resume draft saved successfully.');
    },
    onError: () => toast.error('Failed to save resume draft.'),
  });

  const collectDocumentPages = () => documentPages.map((_, index) => {
    const editor = editorPagesRef.current[index];
    return editor?.innerText.trim() ? sanitizeResumeHtml(editor.innerHTML) : '';
  });

  const handleDocumentInput = (pageIndex) => {
    const editor = editorPagesRef.current[pageIndex];
    if (!editor) return;
    const pages = collectDocumentPages();
    setDocumentPages(pages);
    setResume((previous) => ({ ...previous, documentHtml: pages[0] || '', documentPages: pages }));
    setWordCount(pages.reduce((total, page) => total + countWords(page), 0));
    setIsDirty(true);
    captureSelection();
  };

  const captureSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const applyFormat = (command, value = null) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (selectionRef.current && editor.contains(selectionRef.current.commonAncestorContainer)) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
    document.execCommand(command, false, value);
    captureSelection();
    handleDocumentInput();
  };

  const handleSave = () => {
    const pages = collectDocumentPages();
    const resumeToSave = { ...resume, documentHtml: pages[0] || '', documentPages: pages };
    setResume(resumeToSave);
    saveMutation.mutate(resumeToSave);
  };

  const handleAddBlankPage = () => {
    const pages = collectDocumentPages();
    const nextPageIndex = pages.length;
    const nextPages = [...pages, ''];
    focusNewPageRef.current = nextPageIndex;
    setDocumentPages(nextPages);
    setResume((previous) => ({ ...previous, documentHtml: pages[0] || '', documentPages: nextPages }));
    setWordCount(nextPages.reduce((total, page) => total + countWords(page), 0));
    setActivePage(nextPageIndex);
    setIsDirty(true);
  };

  const handleTitleChange = (event) => {
    setResume((previous) => ({ ...previous, documentTitle: event.target.value }));
    setIsDirty(true);
  };

  const runToolbarButton = (event, command, value = null) => {
    event.preventDefault();
    captureSelection();
    applyFormat(command, value);
  };

  if (isLoading) {
    return (
      <div className="resume-loading-state">
        <Skeleton width="220px" height="2rem" />
        <Skeleton width="100%" height="680px" />
      </div>
    );
  }

  return (
    <div className="resume-word-editor">
      <PageHeader
        title="Resume Builder"
        subtitle="Write and format your resume directly on a blank page."
        actions={(
          <div className="resume-page-actions">
            <Button
              variant="secondary"
              size="md"
              onClick={() => window.print()}
              leftIcon={<Icon name="download" size={16} />}
            >
              Print / Export PDF
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={saveMutation.isPending}
              onClick={handleSave}
              leftIcon={<Icon name="check" size={16} />}
            >
              Save Draft
            </Button>
          </div>
        )}
      />

      <div className="word-ribbon">
        <div className="word-document-name">
          <Icon name="file-text" size={18} color="var(--color-primary)" />
          <input
            aria-label="Document name"
            className="word-document-title"
            value={resume.documentTitle || ''}
            onChange={handleTitleChange}
            placeholder="Untitled Resume"
          />
          <button type="button" className="word-add-page" onClick={handleAddBlankPage}>
            <Icon name="file-plus" size={16} />
            <span>Blank page</span>
          </button>
        </div>

        <div className="word-toolbar" role="toolbar" aria-label="Document formatting">
          <div className="word-toolbar-group">
            <button type="button" className="word-tool-button" aria-label="Undo" title="Undo" onMouseDown={(event) => runToolbarButton(event, 'undo')}>
              <Icon name="undo" size={17} />
            </button>
            <button type="button" className="word-tool-button" aria-label="Redo" title="Redo" onMouseDown={(event) => runToolbarButton(event, 'redo')}>
              <Icon name="redo" size={17} />
            </button>
          </div>
          <span className="word-toolbar-divider" />
          <div className="word-toolbar-group">
            <DropdownSelect
              triggerClassName="word-toolbar-select word-font-select"
              aria-label="Font family"
              ariaLabel="Font family"
              value={fontFamily}
              options={fontFamilyOptions}
              onTriggerMouseDown={captureSelection}
              onChange={(value) => {
                setFontFamily(value);
                applyFormat('fontName', value);
              }}
            />
            <DropdownSelect
              triggerClassName="word-toolbar-select word-size-select"
              aria-label="Font size"
              ariaLabel="Font size"
              value={fontSize}
              options={fontSizeOptions}
              onTriggerMouseDown={captureSelection}
              onChange={(value) => {
                setFontSize(value);
                applyFormat('fontSize', value);
              }}
            />
          </div>
          <span className="word-toolbar-divider" />
          <div className="word-toolbar-group">
            <button type="button" className="word-tool-button word-letter-button" aria-label="Bold" title="Bold" onMouseDown={(event) => runToolbarButton(event, 'bold')}><strong>B</strong></button>
            <button type="button" className="word-tool-button word-letter-button" aria-label="Italic" title="Italic" onMouseDown={(event) => runToolbarButton(event, 'italic')}><em>I</em></button>
            <button type="button" className="word-tool-button word-letter-button" aria-label="Underline" title="Underline" onMouseDown={(event) => runToolbarButton(event, 'underline')}><u>U</u></button>
            <label className="word-color-control" title="Font color">
              <span aria-hidden="true">A</span>
              <input
                type="color"
                aria-label="Font color"
                value={fontColor}
                onMouseDown={captureSelection}
                onChange={(event) => {
                  setFontColor(event.target.value);
                  applyFormat('foreColor', event.target.value);
                }}
              />
            </label>
          </div>
          <span className="word-toolbar-divider" />
          <div className="word-toolbar-group">
            <button type="button" className="word-tool-button" aria-label="Align left" title="Align left" onMouseDown={(event) => runToolbarButton(event, 'justifyLeft')}><Icon name="align-left" size={17} /></button>
            <button type="button" className="word-tool-button" aria-label="Align center" title="Align center" onMouseDown={(event) => runToolbarButton(event, 'justifyCenter')}><Icon name="align-center" size={17} /></button>
            <button type="button" className="word-tool-button" aria-label="Align right" title="Align right" onMouseDown={(event) => runToolbarButton(event, 'justifyRight')}><Icon name="align-right" size={17} /></button>
            <button type="button" className="word-tool-button" aria-label="Bulleted list" title="Bulleted list" onMouseDown={(event) => runToolbarButton(event, 'insertUnorderedList')}><Icon name="list" size={17} /></button>
            <button type="button" className="word-tool-button" aria-label="Numbered list" title="Numbered list" onMouseDown={(event) => runToolbarButton(event, 'insertOrderedList')}><Icon name="list-ordered" size={17} /></button>
          </div>
          <span className="word-toolbar-divider" />
          <DropdownSelect
            triggerClassName="word-toolbar-select word-style-select"
            aria-label="Paragraph style"
            ariaLabel="Paragraph style"
            defaultValue="p"
            options={paragraphStyleOptions}
            onTriggerMouseDown={captureSelection}
            onChange={(value) => applyFormat('formatBlock', value)}
          />
        </div>
      </div>

      <div className="word-workspace">
        <div
          id="printable-resume"
          className="word-pages"
        >
          {documentPages.map((_, index) => (
            <div
              key={index}
              ref={(element) => { editorPagesRef.current[index] = element; }}
              className="word-page"
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label={`Resume page ${index + 1}`}
              aria-multiline="true"
              spellCheck="true"
              data-placeholder="Start typing your resume..."
              onFocus={(event) => {
                editorRef.current = event.currentTarget;
                setActivePage(index);
                captureSelection();
              }}
              onInput={() => handleDocumentInput(index)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                  event.preventDefault();
                  handleSave();
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="word-status-bar" aria-live="polite">
        <span>A4 · Page {activePage + 1} of {documentPages.length}</span>
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <span className={isDirty ? 'word-save-state is-dirty' : 'word-save-state'}>
          <span className="word-save-indicator" />
          {isDirty ? 'Unsaved changes' : saveMutation.isSuccess ? 'All changes saved' : 'Draft'}
        </span>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;

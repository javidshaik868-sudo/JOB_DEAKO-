import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Drawer } from '../common/Modal';
import { OneAiAssistant } from '../common/OneAiAssistant';

export const AppShell = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      />

      {/* Mobile Off-canvas Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        side="left"
        width="220px"
      >
        <Sidebar onCloseDrawer={() => setIsDrawerOpen(false)} />
      </Drawer>

      {/* Main Content Area */}
      <div className="app-main">
        <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
        <main className="app-content page-fade-in" id="main-content">
          <Outlet />
        </main>
        {/* Mobile Fixed Bottom Nav */}
        <MobileNav />
      </div>
      <OneAiAssistant />
    </div>
  );
};

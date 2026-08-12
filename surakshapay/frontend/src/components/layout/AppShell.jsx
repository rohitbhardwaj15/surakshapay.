import React from 'react';
import { useAppSelector, selectPage } from '../../store/hooks.js';
import { selectUser } from '../../store/hooks.js';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import RegisterPage from '../../pages/RegisterPage.jsx';
import OverviewPage from '../../pages/OverviewPage.jsx';
import PolicyPage from '../../pages/PolicyPage.jsx';
import TriggersPage from '../../pages/TriggersPage.jsx';
import ClaimsPage from '../../pages/ClaimsPage.jsx';
import FraudPage from '../../pages/FraudPage.jsx';

const PAGES = {
  register: RegisterPage,
  overview: OverviewPage,
  policy:   PolicyPage,
  triggers: TriggersPage,
  claims:   ClaimsPage,
  fraud:    FraudPage,
};

export default function AppShell() {
  const page = useAppSelector(selectPage);
  const user = useAppSelector(selectUser);
  const PageComponent = PAGES[page] || OverviewPage;

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {user && <Sidebar />}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {user && <Topbar />}
        <div
          key={page}
          className="page-enter"
          style={{ flex:1, overflowY:'auto', padding:'28px', maxHeight:`calc(100vh - ${user ? 'var(--topbar-height)' : '0px'})` }}
        >
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <PageComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

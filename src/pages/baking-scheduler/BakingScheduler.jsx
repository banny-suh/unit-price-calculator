import React from 'react';
import './BakingScheduler.css';

const BakingScheduler = () => {
  return (
    <>
      <header className="topbar">
        <h1 className="title">베이킹 스케줄러</h1>
        <p className="subtitle">빵 생산 계획 및 재료 준비</p>
      </header>

      <main className="container">
        <section className="scheduler-grid">
          {/* Main scheduling area for different bread types */}
          <div className="main-panel">
            {/* Sourdough Schedule Section */}
            <div className="panel-header">
              <h3>사워도우 스케줄</h3>
            </div>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <p>여기에 사워도우 베이킹 스케줄 관리 기능이 들어갑니다.</p>
              {/* Sourdough specific scheduling components will go here */}
            </div>
          </div>

          {/* Side panel for general information or shared tools */}
          <div className="main-panel">
              {/* Sourdough Schedule Section */}
              <div className="panel-header">
                <h3>포카치아 스케줄</h3>
              </div>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <p>여기에 포카치아 베이킹 스케줄 관리 기능이 들어갑니다.</p>
                {/* Sourdough specific scheduling components will go here */}
              </div>
            </div>
        </section>
      </main>
    </>
  );
};

export default BakingScheduler;
import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant: 'blue' | 'green' | 'orange' | 'purple';
  linkTo: string;
}

export default function DashboardCard({ title, value, icon, variant, linkTo }: DashboardCardProps) {
  return (
    <div className="db-card">
      <div className="db-card-body">
        <div className="db-card-text">
          <span className="db-card-title">{title}</span>
          <h3 className="db-card-value">{value}</h3>
        </div>
        <div className={`db-card-icon icon-${variant}`}>{icon}</div>
      </div>
      <div className="db-card-footer">
        <Link to={linkTo} className="db-card-link">View all</Link>
      </div>
    </div>
  );
}

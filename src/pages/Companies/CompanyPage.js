import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CompanyPageLayout } from './CompanyPageLayout';
import { getCompanyBySlug } from '../../api/openrobotx';
import { apiCompanyToDetail } from './companyAdapter';

const CompanyPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    
    getCompanyBySlug(slug)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          const { data: layoutData, theme: layoutTheme } = apiCompanyToDetail(res.data);
          setData(layoutData);
          setTheme(layoutTheme);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
      
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        {/* 使用 Tailwind 实现的 Loading Spinner */}
        <div className="w-12 h-12 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return <Navigate to="/" replace />;
  }

  return <CompanyPageLayout data={data} theme={theme} />;
};

export default CompanyPage;
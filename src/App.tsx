import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Pen, Ink } from './types';
import { PenItem } from './components/PenItem';
import { Modal } from './components/Modal';
import { PlusIcon, PenIcon, ColorSwatchIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon, BrandLogoIcon, PaintBrushIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from './components/icons';
import { BrandLogo } from './components/BrandLogo';
import { ImageUploader } from './components/ImageUploader';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const initialPens: Pen[] = [
  { id: '1', brand: 'Lamy', model: 'Safari', nib: { size: 'Fine', material: 'Steel', features: '', writingFeel: '顺滑但有轻微反馈' }, inkId: '101' },
  { id: '2', brand: 'Pilot', model: 'Custom 823', nib: { size: 'Medium', material: '14k Gold', features: 'Two-tone', writingFeel: '如黄油般顺滑，非常水' }, inkId: '102' },
  { id: '3', brand: 'TWSBI', model: 'Eco', nib: { size: 'Broad', material: 'Steel', features: '', writingFeel: '' }, inkId: null },
];

const initialInks: Ink[] = [
  { id: '101', brand: 'Diamine', name: 'Oxford Blue', color: '#002147' },
  { id: '102', brand: 'Iroshizuku', name: 'Kon-peki', color: '#009bce' },
  { id: '103', brand: 'J. Herbin', name: 'Emerald of Chivor', color: '#1a5750' },
  { id: '104', brand: 'Noodler\'s', name: 'Apache Sunset', color: '#fe7f00' },
];

type Theme = 'twilight' | 'daylight' | 'aurora';

const themes: Record<Theme, Record<string, string>> = {
  twilight: {
    '--color-background-start': '#201b43',
    '--color-background-end': '#4a3f93',
    '--color-surface-primary': 'rgba(30, 27, 67, 0.75)',
    '--color-surface-primary-opaque': 'rgb(30, 27, 67)',
    '--color-surface-secondary': 'rgba(30, 27, 67, 0.45)',
    '--color-surface-inset': 'rgba(30, 27, 67, 0.35)',
    '--color-text-primary': '#F8FAFC',
    '--color-text-secondary': '#E2E8F0',
    '--color-text-subtle': '#A0AEC0',
    '--color-text-accent': '#06b6d4', // cyan-500
    '--color-text-danger': '#fb7185', // rose-400
    '--color-button-accent-bg': '#06b6d4',
    '--color-button-accent-text': '#0F172A',
    '--color-button-accent-hover-bg': '#22d3ee', // cyan-400
    '--color-button-subtle-hover-bg': 'rgba(6, 182, 212, 0.1)',
    '--color-button-danger-hover-bg': 'rgba(251, 113, 133, 0.1)',
    '--color-border-primary': 'rgba(6, 182, 212, 0.2)',
    '--color-border-secondary': 'rgba(6, 182, 212, 0.1)',
    '--color-border-input': 'rgba(6, 182, 212, 0.3)',
    '--color-backdrop': 'rgba(32, 27, 67, 0.4)',
    '--color-shadow': 'rgba(0, 0, 0, 0.5)',
    '--paper-texture-opacity': '0.02',
    '--paper-texture-blend-mode': 'overlay',
  },
  daylight: {
    '--color-background-start': '#fde047', // yellow-300
    '--color-background-end': '#fb923c', // orange-400
    '--color-surface-primary': 'rgba(255, 255, 255, 0.7)',
    '--color-surface-primary-opaque': 'rgb(255, 255, 255)',
    '--color-surface-secondary': 'rgba(241, 245, 249, 0.8)',
    '--color-surface-inset': 'rgba(241, 245, 249, 0.9)',
    '--color-text-primary': '#1E293B',
    '--color-text-secondary': '#475569',
    '--color-text-subtle': '#64748B',
    '--color-text-accent': '#2563eb', // blue-600
    '--color-text-danger': '#e11d48', // rose-600
    '--color-button-accent-bg': '#2563eb',
    '--color-button-accent-text': '#FFFFFF',
    '--color-button-accent-hover-bg': '#3b82f6', // blue-500
    '--color-button-subtle-hover-bg': 'rgba(37, 99, 235, 0.1)',
    '--color-button-danger-hover-bg': 'rgba(225, 29, 72, 0.1)',
    '--color-border-primary': 'rgba(0, 0, 0, 0.08)',
    '--color-border-secondary': 'rgba(0, 0, 0, 0.05)',
    '--color-border-input': '#CBD5E1',
    '--color-backdrop': 'rgba(255, 255, 255, 0.1)',
    '--color-shadow': 'rgba(100, 116, 139, 0.2)',
    '--paper-texture-opacity': '0.05',
    '--paper-texture-blend-mode': 'multiply',
  },
  aurora: {
    '--color-background-start': '#10b981', // emerald-500
    '--color-background-end': '#ec4899', // pink-500
    '--color-surface-primary': 'rgba(11, 22, 40, 0.65)',
    '--color-surface-primary-opaque': 'rgb(11, 22, 40)',
    '--color-surface-secondary': 'rgba(11, 22, 40, 0.4)',
    '--color-surface-inset': 'rgba(11, 22, 40, 0.3)',
    '--color-text-primary': '#F8FAFC',
    '--color-text-secondary': '#E2E8F0',
    '--color-text-subtle': '#94A3B8',
    '--color-text-accent': '#a3e635', // lime-400
    '--color-text-danger': '#f97316', // orange-500
    '--color-button-accent-bg': '#a3e635',
    '--color-button-accent-text': '#1e3a13', // green-950
    '--color-button-accent-hover-bg': '#bef264', // lime-300
    '--color-button-subtle-hover-bg': 'rgba(163, 230, 53, 0.1)',
    '--color-button-danger-hover-bg': 'rgba(249, 115, 22, 0.1)',
    '--color-border-primary': 'rgba(163, 230, 53, 0.2)',
    '--color-border-secondary': 'rgba(163, 230, 53, 0.1)',
    '--color-border-input': 'rgba(163, 230, 53, 0.3)',
    '--color-backdrop': 'rgba(11, 22, 40, 0.4)',
    '--color-shadow': 'rgba(0, 0, 0, 0.5)',
    '--paper-texture-opacity': '0.02',
    '--paper-texture-blend-mode': 'overlay',
  },
};

const paperTextureUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const colorDifference = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return Infinity;
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};


const App: React.FC = () => {
  const [pens, setPens] = useState<Pen[]>(initialPens);
  const [inks, setInks] = useState<Ink[]>(initialInks);
  const [brandLogos, setBrandLogos] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'pens' | 'inks'>('pens');
  const [theme, setTheme] = useState<Theme>('twilight');
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  useEffect(() => {
    const root = document.body;
    const themeProperties = themes[theme];
    Object.keys(themeProperties).forEach(key => {
        root.style.setProperty(key, themeProperties[key]);
    });
    root.style.background = `linear-gradient(to bottom right, var(--color-background-start), var(--color-background-end))`;
  }, [theme]);
  
  const normalizeBrand = (brand: string) => brand.trim().toLowerCase();

  // === Pen State & Handlers ===
  const [isAddPenModalOpen, setAddPenModalOpen] = useState(false);
  const [newPen, setNewPen] = useState({ brand: '', model: '', nib: { size: '', material: '', features: '', writingFeel: '' } });
  const [newPenLogo, setNewPenLogo] = useState<string | null>(null);

  const [editingPen, setEditingPen] = useState<Pen | null>(null);
  const [penToEdit, setPenToEdit] = useState<Omit<Pen, 'id' | 'inkId'>>({ brand: '', model: '', nib: { size: '', material: '', features: '', writingFeel: '' } });
  const [editingPenLogo, setEditingPenLogo] = useState<string | null>(null);

  useEffect(() => {
    if (editingPen) {
      setPenToEdit({ brand: editingPen.brand, model: editingPen.model, nib: editingPen.nib });
      setEditingPenLogo(brandLogos[normalizeBrand(editingPen.brand)] || null);
    }
  }, [editingPen, brandLogos]);

  const handleAddPen = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPen.brand && newPen.model && newPen.nib.size && newPen.nib.material) {
      const trimmedBrand = newPen.brand.trim();
      if (newPenLogo) {
        setBrandLogos(prev => ({ ...prev, [normalizeBrand(trimmedBrand)]: newPenLogo }));
      }
      setPens(prev => [...prev, { ...newPen, brand: trimmedBrand, id: Date.now().toString(), inkId: null }]);
      setNewPen({ brand: '', model: '', nib: { size: '', material: '', features: '', writingFeel: '' } });
      setNewPenLogo(null);
      setAddPenModalOpen(false);
    }
  };

  const handleOpenPenEditor = (pen: Pen) => setEditingPen(pen);

  const handleUpdatePen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPen) return;
    const trimmedBrand = penToEdit.brand.trim();
    if (editingPenLogo) {
        setBrandLogos(prev => ({ ...prev, [normalizeBrand(trimmedBrand)]: editingPenLogo }));
    }
    setPens(pens.map(p => p.id === editingPen.id ? { ...p, ...penToEdit, brand: trimmedBrand } : p));
    setEditingPen(null);
    setEditingPenLogo(null);
  }

  const handleDeletePen = (penId: string) => {
    if (window.confirm("您确定要删除这支钢笔吗？")) {
      setPens(pens.filter(p => p.id !== penId));
    }
  };


  // === Ink State & Handlers ===
  const [isAddInkModalOpen, setAddInkModalOpen] = useState(false);
  const [newInk, setNewInk] = useState({ brand: '', name: '', color: '#000000' });
  const [newInkLogo, setNewInkLogo] = useState<string | null>(null);
  
  const [editingInk, setEditingInk] = useState<Ink | null>(null);
  const [inkToEdit, setInkToEdit] = useState<Omit<Ink, 'id'>>({ brand: '', name: '', color: '#000000' });
  const [editingInkLogo, setEditingInkLogo] = useState<string | null>(null);

  useEffect(() => {
    if(editingInk) {
        setInkToEdit({ brand: editingInk.brand, name: editingInk.name, color: editingInk.color });
        setEditingInkLogo(brandLogos[normalizeBrand(editingInk.brand)] || null);
    }
  }, [editingInk, brandLogos]);


  const handleAddInk = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInk.brand && newInk.name) {
      const trimmedBrand = newInk.brand.trim();
      if (newInkLogo) {
        setBrandLogos(prev => ({ ...prev, [normalizeBrand(trimmedBrand)]: newInkLogo }));
      }
      setInks(prev => [...prev, { ...newInk, brand: trimmedBrand, id: Date.now().toString() }]);
      setNewInk({ brand: '', name: '', color: '#000000' });
      setNewInkLogo(null);
      setAddInkModalOpen(false);
    }
  };

  const handleOpenInkEditor = (ink: Ink) => {
    setActiveInkMenuId(null);
    setEditingInk(ink);
  };

  const handleUpdateInk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInk) return;
    const trimmedBrand = inkToEdit.brand.trim();
    if (editingInkLogo) {
        setBrandLogos(prev => ({ ...prev, [normalizeBrand(trimmedBrand)]: editingInkLogo }));
    }
    setInks(inks.map(i => i.id === editingInk.id ? { ...i, ...inkToEdit, brand: trimmedBrand } : i));
    setEditingInk(null);
    setEditingInkLogo(null);
  }

  const handleDeleteInk = (inkId: string) => {
    setActiveInkMenuId(null);
    const inkInUse = pens.some(p => p.inkId === inkId);
    let confirmed = false;
    if (inkInUse) {
        confirmed = window.confirm("这款墨水正在使用中。删除它会同时清空相关钢笔的墨水。您确定吗？");
    } else {
        confirmed = window.confirm("您确定要删除这款墨水吗？");
    }

    if(confirmed) {
        setPens(pens.map(p => p.inkId === inkId ? { ...p, inkId: null } : p));
        setInks(inks.filter(i => i.id !== inkId));
    }
  };

  // === Inking/Cleaning State & Handlers ===
  const [penToInk, setPenToInk] = useState<Pen | null>(null);
  const handleOpenInkSelector = (pen: Pen) => setPenToInk(pen);
  const handleCleanPen = (penId: string) => setPens(pens.map(p => p.id === penId ? {...p, inkId: null} : p));
  const handleInkPen = (penId: string, inkId: string) => {
      setPens(pens.map(p => p.id === penId ? {...p, inkId} : p));
      setPenToInk(null);
  };

  // === Filtering/Sorting State & Logic ===
  const [penSearch, setPenSearch] = useState('');
  const [inkSearch, setInkSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [penSortConfig, setPenSortConfig] = useState<{ key: 'brand' | 'model' | 'nibSize', direction: 'ascending' | 'descending' }>({ key: 'brand', direction: 'ascending' });
  const [activeInkMenuId, setActiveInkMenuId] = useState<string | null>(null);

  const getInkById = useCallback((inkId: string | null) => inks.find(ink => ink.id === inkId), [inks]);

  const filteredPens = useMemo(() => {
    let pensToProcess = [...pens];
    if (penSearch) {
      const searchTerm = penSearch.toLowerCase();
      pensToProcess = pensToProcess.filter(pen => 
        pen.brand.toLowerCase().includes(searchTerm) ||
        pen.model.toLowerCase().includes(searchTerm) ||
        pen.nib.size.toLowerCase().includes(searchTerm) ||
        pen.nib.material.toLowerCase().includes(searchTerm) ||
        (pen.nib.features || '').toLowerCase().includes(searchTerm)
      );
    }

    pensToProcess.sort((a, b) => {
        const { key, direction } = penSortConfig;
        const valA = (key === 'nibSize' ? a.nib.size : a[key]).toLowerCase();
        const valB = (key === 'nibSize' ? b.nib.size : b[key]).toLowerCase();
        if (valA < valB) return direction === 'ascending' ? -1 : 1;
        if (valA > valB) return direction === 'ascending' ? 1 : -1;
        return 0;
    });

    return pensToProcess;
  }, [pens, penSearch, penSortConfig]);

  const filteredInks = useMemo(() => {
    const textFiltered = inkSearch ? inks.filter(ink => {
        const searchTerm = inkSearch.toLowerCase();
        return ink.brand.toLowerCase().includes(searchTerm) ||
               ink.name.toLowerCase().includes(searchTerm) ||
               ink.color.toLowerCase().includes(searchTerm)
      }) : inks;

    return selectedColor ? textFiltered.filter(ink => colorDifference(ink.color, selectedColor) < 75) : textFiltered;
  }, [inks, inkSearch, selectedColor]);

  const setSortKey = (key: 'brand' | 'model' | 'nibSize') => setPenSortConfig(prev => ({
    key,
    direction: prev.key === key ? (prev.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending'
  }));
  
  // === Components ===
  const Fab = () => (
    <button
      onClick={() => activeTab === 'pens' ? setAddPenModalOpen(true) : setAddInkModalOpen(true)}
      className="absolute bottom-5 right-5 bg-[var(--color-button-accent-bg)] text-[var(--color-button-accent-text)] rounded-full p-3.5 shadow-lg hover:bg-[var(--color-button-accent-hover-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-button-accent-bg)] focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-200"
      aria-label={activeTab === 'pens' ? '添加新钢笔' : '添加新墨水'}
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <style>{`
        .texture-paper { position: relative; z-index: 0; }
        .texture-paper::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("${paperTextureUrl}");
          opacity: var(--paper-texture-opacity);
          mix-blend-mode: var(--paper-texture-blend-mode);
          pointer-events: none; border-radius: inherit; z-index: -1;
        }
      `}</style>
      <div className="w-full max-w-sm h-[750px] bg-[var(--color-surface-secondary)] rounded-[32px] shadow-2xl p-2 flex flex-col overflow-hidden ring-1 ring-black/10 backdrop-blur-sm" style={{boxShadow: `0 25px 50px -12px var(--color-shadow)`}}>
        <div className="bg-[var(--color-surface-primary)] rounded-[24px] flex-1 flex flex-col relative overflow-hidden backdrop-blur-lg texture-paper">
          <header className="flex items-center justify-between space-x-2 p-3 border-b border-[var(--color-border-primary)] flex-shrink-0">
            <div className="flex items-center space-x-2">
                <BrandLogoIcon className="w-8 h-8 text-[var(--color-text-primary)]" />
                <div>
                  <h1 className="text-lg font-bold text-[var(--color-text-primary)]">Inked</h1>
                  <p className="text-xs text-[var(--color-text-secondary)]">我的收藏</p>
                </div>
            </div>
             <div className="relative">
                <button onClick={() => setShowThemeSwitcher(!showThemeSwitcher)} className="p-1 rounded-full hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    <PaintBrushIcon className="w-5 h-5" />
                </button>
                {showThemeSwitcher && (
                    <div className="absolute top-full right-0 mt-2 z-20">
                        <ThemeSwitcher currentTheme={theme} onThemeChange={(t) => { setTheme(t); setShowThemeSwitcher(false); }} />
                    </div>
                )}
            </div>
          </header>

          <nav className="flex p-1 bg-[var(--color-surface-secondary)] mx-3 mt-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
            <button onClick={() => setActiveTab('pens')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'pens' ? 'bg-[var(--color-surface-primary)] shadow-sm text-[var(--color-text-accent)] texture-paper' : 'text-[var(--color-text-secondary)]'}`}>钢笔</button>
            <button onClick={() => setActiveTab('inks')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'inks' ? 'bg-[var(--color-surface-primary)] shadow-sm text-[var(--color-text-accent)] texture-paper' : 'text-[var(--color-text-secondary)]'}`}>墨水</button>
          </nav>
          
          <main className="flex-1 overflow-y-auto p-3 pb-20" onClick={() => activeInkMenuId && setActiveInkMenuId(null)}>
            {activeTab === 'pens' && (
              <div>
                <div className="mb-3"><input type="text" value={penSearch} onChange={e => setPenSearch(e.target.value)} placeholder="按品牌、型号或笔尖搜索..." className="w-full border border-[var(--color-border-input)] bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 text-sm focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] placeholder:text-[var(--color-text-subtle)]" aria-label="搜索钢笔" /></div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-[var(--color-text-secondary)] font-medium">排序:</span>
                  <div className="flex space-x-1 p-0.5 bg-[var(--color-surface-secondary)] rounded-lg backdrop-blur-sm">
                    {(['brand', 'model', 'nibSize'] as const).map(key => (
                      <button key={key} onClick={() => setSortKey(key)} className={`flex items-center space-x-1 capitalize px-2 py-1 text-xs font-semibold rounded-md transition-colors ${ penSortConfig.key === key ? 'bg-[var(--color-surface-primary)] shadow-sm text-[var(--color-text-accent)] texture-paper' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-primary)]' }`}>
                        <span>{key === 'nibSize' ? '笔尖尺寸' : (key === 'brand' ? '品牌' : '型号')}</span>
                        {penSortConfig.key === key && (penSortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredPens.map(pen => (
                  <PenItem key={pen.id} pen={pen} ink={getInkById(pen.inkId)} onInk={handleOpenInkSelector} onClean={handleCleanPen} onEdit={handleOpenPenEditor} onDelete={handleDeletePen} customLogo={brandLogos[normalizeBrand(pen.brand)]} />
                ))}
              </div>
            )}
            {activeTab === 'inks' && (
              <div>
                <div className="mb-3 flex items-center space-x-2">
                  <div className="relative flex-grow"><input type="text" value={inkSearch} onChange={e => setInkSearch(e.target.value)} placeholder="按品牌或名称搜索..." className="w-full border border-[var(--color-border-input)] bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 text-sm focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] placeholder:text-[var(--color-text-subtle)]" aria-label="搜索墨水" /></div>
                  <div className="relative">
                    <label htmlFor="color-picker" className="w-9 h-9 flex items-center justify-center rounded-md cursor-pointer border-2" style={{ backgroundColor: selectedColor || 'transparent', borderColor: selectedColor ? selectedColor : 'var(--color-border-input)' }} aria-label="选择颜色进行筛选">{!selectedColor && <ColorSwatchIcon className="w-5 h-5 text-[var(--color-text-subtle)]" />}</label>
                    <input id="color-picker" type="color" value={selectedColor || '#ffffff'} onChange={e => setSelectedColor(e.target.value)} className="absolute opacity-0 w-0 h-0" />
                    {selectedColor && (<button onClick={() => setSelectedColor(null)} className="absolute -top-1.5 -right-1.5 bg-gray-600 text-white rounded-full p-0.5 shadow-md flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="清除颜色筛选"><CloseIcon className="w-3 h-3" /></button>)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {filteredInks.map(ink => (
                    <div key={ink.id} className="bg-[var(--color-surface-primary)] p-2 rounded-xl shadow-sm text-center backdrop-blur-lg texture-paper relative" style={{boxShadow: `0 1px 2px 0 var(--color-shadow)`}}>
                      <button onClick={(e) => {e.stopPropagation(); setActiveInkMenuId(activeInkMenuId === ink.id ? null : ink.id)}} className="absolute top-0 right-0 p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text-primary)]"><EllipsisVerticalIcon className="w-4 h-4" /></button>
                      {activeInkMenuId === ink.id && (
                        <div className="absolute top-6 right-1 bg-[var(--color-surface-secondary)] rounded-lg shadow-xl p-1 z-10 w-24 backdrop-blur-sm texture-paper">
                          <button onClick={() => handleOpenInkEditor(ink)} className="w-full text-left flex items-center space-x-2 text-xs p-1.5 rounded-md hover:bg-[var(--color-border-primary)] text-[var(--color-text-secondary)]">
                            <PencilSquareIcon className="w-3.5 h-3.5"/><span>编辑</span>
                          </button>
                          <button onClick={() => handleDeleteInk(ink.id)} className="w-full text-left flex items-center space-x-2 text-xs p-1.5 rounded-md hover:bg-[var(--color-button-danger-hover-bg)] text-[var(--color-text-danger)]">
                            <TrashIcon className="w-3.5 h-3.5"/><span>删除</span>
                          </button>
                        </div>
                      )}
                      <div className="relative w-12 h-12 mx-auto mb-2">
                          <BrandLogo brandName={ink.brand} className="w-12 h-12" customLogo={brandLogos[normalizeBrand(ink.brand)]} />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[var(--color-surface-primary)]" style={{ backgroundColor: ink.color }}></div>
                      </div>
                      <p className="font-semibold text-xs text-[var(--color-text-primary)] truncate">{ink.brand}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] truncate">{ink.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
          <Fab />
        </div>
      </div>

      {/* === MODALS === */}
      <Modal isOpen={isAddPenModalOpen} onClose={() => { setAddPenModalOpen(false); setNewPenLogo(null); }} title="添加新钢笔">
        <form onSubmit={handleAddPen} className="space-y-3">
          <ImageUploader brandName={newPen.brand} onImageSelect={setNewPenLogo} />
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">品牌</label><input type="text" value={newPen.brand} onChange={e => setNewPen({...newPen, brand: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">型号</label><input type="text" value={newPen.model} onChange={e => setNewPen({...newPen, model: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div className="space-y-3 p-3 bg-[var(--color-surface-inset)] rounded-lg border border-[var(--color-border-primary)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] -mb-1">笔尖详情</h3>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">尺寸</label><input type="text" value={newPen.nib.size} onChange={e => setNewPen({...newPen, nib: {...newPen.nib, size: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: F, 1.1 Stub" required /></div>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">材质</label><input type="text" value={newPen.nib.material} onChange={e => setNewPen({...newPen, nib: {...newPen.nib, material: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: 钢尖, 14k金" required /></div>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">特性 (可选)</label><input type="text" value={newPen.nib.features} onChange={e => setNewPen({...newPen, nib: {...newPen.nib, features: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: 双色, 刻花" /></div>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">写感 (可选)</label><textarea value={newPen.nib.writingFeel} onChange={e => setNewPen({...newPen, nib: {...newPen.nib, writingFeel: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: 顺滑, 有阻尼感" rows={2}></textarea></div>
          </div>
          <button type="submit" className="w-full bg-[var(--color-button-accent-bg)] text-[var(--color-button-accent-text)] py-2 rounded-lg font-semibold hover:bg-[var(--color-button-accent-hover-bg)] transition-colors flex items-center justify-center space-x-2"><PenIcon className="w-5 h-5" /><span>添加钢笔</span></button>
        </form>
      </Modal>

      <Modal isOpen={!!editingPen} onClose={() => setEditingPen(null)} title="编辑钢笔">
        <form onSubmit={handleUpdatePen} className="space-y-3">
          <ImageUploader brandName={penToEdit.brand} currentImage={editingPenLogo} onImageSelect={setEditingPenLogo} />
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">品牌</label><input type="text" value={penToEdit.brand} onChange={e => setPenToEdit({...penToEdit, brand: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">型号</label><input type="text" value={penToEdit.model} onChange={e => setPenToEdit({...penToEdit, model: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div className="space-y-3 p-3 bg-[var(--color-surface-inset)] rounded-lg border border-[var(--color-border-primary)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] -mb-1">笔尖详情</h3>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">尺寸</label><input type="text" value={penToEdit.nib.size} onChange={e => setPenToEdit({...penToEdit, nib: {...penToEdit.nib, size: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: F, 1.1 Stub" required /></div>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">材质</label><input type="text" value={penToEdit.nib.material} onChange={e => setPenToEdit({...penToEdit, nib: {...penToEdit.nib, material: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: 钢尖, 14k金" required /></div>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">特性 (可选)</label><input type="text" value={penToEdit.nib.features} onChange={e => setPenToEdit({...penToEdit, nib: {...penToEdit.nib, features: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: 双色, 刻花" /></div>
            <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">写感 (可选)</label><textarea value={penToEdit.nib.writingFeel || ''} onChange={e => setPenToEdit({...penToEdit, nib: {...penToEdit.nib, writingFeel: e.target.value}})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" placeholder="例如: 顺滑, 有阻尼感" rows={2}></textarea></div>
          </div>
          <button type="submit" className="w-full bg-[var(--color-button-accent-bg)] text-[var(--color-button-accent-text)] py-2 rounded-lg font-semibold hover:bg-[var(--color-button-accent-hover-bg)] transition-colors flex items-center justify-center space-x-2"><PenIcon className="w-5 h-5" /><span>更新钢笔</span></button>
        </form>
      </Modal>

      <Modal isOpen={isAddInkModalOpen} onClose={() => { setAddInkModalOpen(false); setNewInkLogo(null); }} title="添加新墨水">
        <form onSubmit={handleAddInk} className="space-y-3">
          <ImageUploader brandName={newInk.brand} onImageSelect={setNewInkLogo} />
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">品牌</label><input type="text" value={newInk.brand} onChange={e => setNewInk({...newInk, brand: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">墨水名称</label><input type="text" value={newInk.name} onChange={e => setNewInk({...newInk, name: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">颜色</label><div className="flex items-center space-x-2 mt-1"><input type="color" value={newInk.color} onChange={e => setNewInk({...newInk, color: e.target.value})} className="h-9 w-9 p-0 border-0 cursor-pointer rounded-md" /><input type="text" value={newInk.color} onChange={e => setNewInk({...newInk, color: e.target.value})} className="block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" /></div></div>
          <button type="submit" className="w-full bg-[var(--color-button-accent-bg)] text-[var(--color-button-accent-text)] py-2 rounded-lg font-semibold hover:bg-[var(--color-button-accent-hover-bg)] transition-colors flex items-center justify-center space-x-2"><ColorSwatchIcon className="w-5 h-5" /><span>添加墨水</span></button>
        </form>
      </Modal>

      <Modal isOpen={!!editingInk} onClose={() => setEditingInk(null)} title="编辑墨水">
        <form onSubmit={handleUpdateInk} className="space-y-3">
          <ImageUploader brandName={inkToEdit.brand} currentImage={editingInkLogo} onImageSelect={setEditingInkLogo} />
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">品牌</label><input type="text" value={inkToEdit.brand} onChange={e => setInkToEdit({...inkToEdit, brand: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">墨水名称</label><input type="text" value={inkToEdit.name} onChange={e => setInkToEdit({...inkToEdit, name: e.target.value})} className="mt-1 block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" required /></div>
          <div><label className="text-sm font-medium text-[var(--color-text-secondary)]">颜色</label><div className="flex items-center space-x-2 mt-1"><input type="color" value={inkToEdit.color} onChange={e => setInkToEdit({...inkToEdit, color: e.target.value})} className="h-9 w-9 p-0 border-0 cursor-pointer rounded-md" /><input type="text" value={inkToEdit.color} onChange={e => setInkToEdit({...inkToEdit, color: e.target.value})} className="block w-full border border-[var(--color-border-input)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-md shadow-sm p-2 focus:ring-[var(--color-text-accent)] focus:border-[var(--color-text-accent)] text-sm" /></div></div>
          <button type="submit" className="w-full bg-[var(--color-button-accent-bg)] text-[var(--color-button-accent-text)] py-2 rounded-lg font-semibold hover:bg-[var(--color-button-accent-hover-bg)] transition-colors flex items-center justify-center space-x-2"><ColorSwatchIcon className="w-5 h-5" /><span>更新墨水</span></button>
        </form>
      </Modal>

      <Modal isOpen={penToInk !== null} onClose={() => setPenToInk(null)} title={`为 ${penToInk?.brand || ''} ${penToInk?.model || ''} 上墨`}>
        <div className="max-h-80 overflow-y-auto">
          <div className="grid grid-cols-1 gap-1">
            {inks.map(ink => (
              <button key={ink.id} onClick={() => penToInk && handleInkPen(penToInk.id, ink.id)} className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors text-left">
                <BrandLogo brandName={ink.brand} className="w-8 h-8 flex-shrink-0" customLogo={brandLogos[normalizeBrand(ink.brand)]} />
                <div className="flex-grow"><p className="font-semibold text-[var(--color-text-primary)] text-sm">{ink.brand}</p><p className="text-[var(--color-text-secondary)] text-xs truncate">{ink.name}</p></div>
                <div className="w-5 h-5 rounded-full border border-[var(--color-border-primary)] flex-shrink-0" style={{ backgroundColor: ink.color }}></div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { Search, BookOpen, ThumbsUp, Eye, Tag, ChevronRight, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  titulo: string;
  categoria: string;
  conteudo: string;
  autor: string;
  views: number;
  likes: number;
  tags: string[];
  criado_em: string;
}

const categories = ['Todos', 'Rede', 'Acesso', 'Hardware', 'Backup', 'Monitoramento', 'Segurança'];

const categoryColors: Record<string, string> = {
  Rede: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Acesso: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
  Hardware: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Backup: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  Monitoramento: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  Segurança: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

export default function BaseConhecimento() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const { data } = await supabase
      .from('base_conhecimento')
      .select('*')
      .order('criado_em', { ascending: false });
    setArticles((data as Article[]) ?? []);
    setLoading(false);
  }

  async function curtir(id: string) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    await supabase
      .from('base_conhecimento')
      .update({ likes: article.likes + 1 })
      .eq('id', id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
  }

  const filtered = articles.filter(a => {
    const matchSearch = a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (a.tags ?? []).some(t => t.includes(search.toLowerCase()));
    const matchCat = category === 'Todos' || a.categoria === category;
    return matchSearch && matchCat;
  });

  const selectedArticle = articles.find(a => a.id === selected);

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-gray-400">Carregando artigos...</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header search */}
      <div className="card p-6 bg-gradient-to-br from-brand-500/5 to-brand-500/10 dark:from-brand-500/10 dark:to-brand-500/5 border-brand-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-brand-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Base de Conhecimento</h2>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Artigo</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {articles.length} artigos disponíveis
        </p>
        <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar artigos, tags..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === c
                ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Articles list */}
        <div className={`flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 self-start ${selected ? 'hidden lg:grid' : ''}`}>
          {filtered.map(a => (
            <div
              key={a.id}
              onClick={() => setSelected(selected === a.id ? null : a.id)}
              className={`card p-4 cursor-pointer hover:shadow-md dark:hover:shadow-dark-900/50 transition-all duration-200 ${selected === a.id ? 'border-brand-500/50' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[a.categoria] ?? 'badge-neutral'}`}>
                  {a.categoria}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 leading-snug">{a.titulo}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{a.conteudo}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{a.views}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{a.likes}</span>
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{(a.tags ?? []).length}</span>
                <span className="ml-auto">{a.autor}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400 text-sm">Nenhum artigo encontrado.</div>
          )}
        </div>

        {/* Article detail */}
        {selectedArticle && (
          <div className="w-full lg:w-96 flex-shrink-0 card p-5 animate-slide-in self-start">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[selectedArticle.categoria] ?? 'badge-neutral'}`}>
                {selectedArticle.categoria}
              </span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3 leading-snug">{selectedArticle.titulo}</h3>
            <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{selectedArticle.conteudo}</p>
              <p className="text-sm text-gray-400 mt-3">Este artigo contém instruções detalhadas com capturas de tela e exemplos práticos para ajudar na resolução do problema descrito.</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(selectedArticle.tags ?? []).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-100 dark:border-dark-700 pt-4">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{selectedArticle.views} views</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{selectedArticle.likes} likes</span>
              <span className="ml-auto text-xs">{selectedArticle.autor}</span>
            </div>
            <button
              onClick={() => curtir(selectedArticle.id)}
              className="w-full btn-primary text-sm mt-4"
            >
              Marcar como Útil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

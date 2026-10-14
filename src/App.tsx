import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  SlidersHorizontal,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Category {
  id: string;
  name: string;
  weight: number;
  color: string;
  description: string;
}

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#a855f7', '#d946ef', '#fb923c', '#84cc16', '#0ea5e9',
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Performance', weight: 25, color: '#6366f1', description: 'Speed, efficiency, and optimization metrics' },
  { id: '2', name: 'Quality', weight: 20, color: '#8b5cf6', description: 'Code quality, maintainability, and best practices' },
  { id: '3', name: 'Innovation', weight: 15, color: '#ec4899', description: 'Creativity and novel approaches to problem solving' },
  { id: '4', name: 'Reliability', weight: 18, color: '#f97316', description: 'Consistency, uptime, and error handling' },
  { id: '5', name: 'Scalability', weight: 12, color: '#22c55e', description: 'Ability to handle growth and increased load' },
  { id: '6', name: 'Security', weight: 10, color: '#06b6d4', description: 'Protection against vulnerabilities and threats' },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeTab, setActiveTab] = useState<'bars' | 'pie' | 'table'>('bars');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const totalWeight = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.weight, 0);
  }, [categories]);

  const normalizedWeights = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      percentage: totalWeight > 0 ? (cat.weight / totalWeight) * 100 : 0,
    }));
  }, [categories, totalWeight]);

  const chartData = useMemo(() => {
    return normalizedWeights.map(cat => ({
      name: cat.name,
      weight: cat.weight,
      percentage: cat.percentage.toFixed(1),
      fill: cat.color,
    }));
  }, [normalizedWeights]);

  const updateWeight = (id: string, newWeight: number) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, weight: Math.max(0, Math.min(100, newWeight)) } : cat))
    );
  };

  const addCategory = () => {
    const newCat: Category = {
      id: generateId(),
      name: `Category ${categories.length + 1}`,
      weight: 10,
      color: COLORS[categories.length % COLORS.length],
      description: 'New category description',
    };
    setCategories(prev => [...prev, newCat]);
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const updateCategoryName = (id: string, name: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const resetCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    setExpandedCard(null);
  };

  const exportWeights = () => {
    const data = {
      categories: normalizedWeights,
      totalWeight,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'category-weights.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Category Weights Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Individual weight breakdown for each scoring category
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetCategories}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={exportWeights}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all text-sm font-medium"
              >
                <Download size={16} />
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
          >
            <p className="text-gray-400 text-sm">Total Categories</p>
            <p className="text-3xl font-bold text-white mt-1">{categories.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
          >
            <p className="text-gray-400 text-sm">Raw Weight Sum</p>
            <p className="text-3xl font-bold text-indigo-400 mt-1">{totalWeight}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
          >
            <p className="text-gray-400 text-sm">Normalized Total</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">100%</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Category Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-indigo-400" />
                Individual Weights
              </h2>
              <button
                onClick={addCategory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-sm transition-all"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {normalizedWeights.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedCard(expandedCard === cat.id ? null : cat.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-300">
                            {cat.weight} pts
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                            {cat.percentage.toFixed(1)}%
                          </span>
                          {expandedCard === cat.id ? (
                            <ChevronUp size={16} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      {/* Weight Bar */}
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedCard === cat.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-white/5">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Name</label>
                                <input
                                  type="text"
                                  value={cat.name}
                                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                                <input
                                  type="text"
                                  value={cat.description}
                                  onChange={(e) => {
                                    setCategories(prev =>
                                      prev.map(c => c.id === cat.id ? { ...c, description: e.target.value } : c)
                                    );
                                  }}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1 flex justify-between">
                                  <span>Weight</span>
                                  <span className="font-mono">{cat.weight}</span>
                                </label>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={cat.weight}
                                  onChange={(e) => updateWeight(cat.id, parseInt(e.target.value))}
                                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCategory(cat.id);
                                  setExpandedCard(null);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition-all"
                              >
                                <Trash2 size={12} />
                                Remove Category
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel - Charts */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
              <button
                onClick={() => setActiveTab('bars')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'bars'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 size={16} />
                Bar Chart
              </button>
              <button
                onClick={() => setActiveTab('pie')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'pie'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <PieChart size={16} />
                Pie Chart
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'table'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <GripVertical size={16} />
                Table
              </button>
            </div>

            {/* Chart Area */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              {activeTab === 'bars' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Weight Distribution</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        fontSize={12}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                        formatter={(value: number, name: string) => [`${value} pts`, name]}
                      />
                      <Bar dataKey="weight" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'pie' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Weight Proportions</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPie>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={130}
                        paddingAngle={3}
                        dataKey="weight"
                        nameKey="name"
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                        formatter={(value: number, name: string) => [`${value} pts`, name]}
                      />
                      <Legend
                        wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'table' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Individual Weights Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Weight</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Percentage</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {normalizedWeights.map((cat, index) => (
                          <motion.tr
                            key={cat.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                <span className="font-medium">{cat.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-indigo-300">{cat.weight}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${cat.percentage}%`,
                                      backgroundColor: cat.color,
                                    }}
                                  />
                                </div>
                                <span className="text-gray-300">{cat.percentage.toFixed(1)}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-400 max-w-[200px] truncate">
                              {cat.description}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-white/20">
                          <td className="py-3 px-4" colSpan={2}>
                            <span className="font-semibold">Total</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-indigo-300">
                            {totalWeight}
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-400">100%</td>
                          <td className="py-3 px-4"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Weight Breakdown Cards */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Weight Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {normalizedWeights
                  .sort((a, b) => b.weight - a.weight)
                  .map((cat, index) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          {cat.weight}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{cat.name}</p>
                        <p className="text-xs text-gray-400 truncate">{cat.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-mono font-semibold" style={{ color: cat.color }}>
                          {cat.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-gray-500 text-sm">
          <p>Category Weights Dashboard • Individual weights for each scoring category</p>
        </div>
      </footer>
    </div>
  );
}

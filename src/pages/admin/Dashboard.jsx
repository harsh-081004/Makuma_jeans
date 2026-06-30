import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI, categoriesAPI, inquiriesAPI, uploadAPI, settingsAPI, lookbookAPI } from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ heroTitle: '', heroSubtitle: '', heroDescription: '', heroImage: '', heroImagePublicId: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [lookbookItems, setLookbookItems] = useState([]);
  const [showAddLookbook, setShowAddLookbook] = useState(false);
  const [lookbookForm, setLookbookForm] = useState({ title: '', image: '', imagePublicId: '', category: '' });
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [uploadingLookbookImage, setUploadingLookbookImage] = useState(false);

  const admin = JSON.parse(localStorage.getItem('makuma_admin') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('makuma_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prodRes, catRes, inqRes, setRes, lbRes] = await Promise.all([
        productsAPI.list(),
        categoriesAPI.list(),
        inquiriesAPI.list(),
        settingsAPI.get(),
        lookbookAPI.list(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setInquiries(inqRes.data || []);
      setLookbookItems(lbRes.data || []);
      if (setRes.data) {
        setSettingsForm({
          heroTitle: setRes.data.heroTitle || '',
          heroSubtitle: setRes.data.heroSubtitle || '',
          heroDescription: setRes.data.heroDescription || '',
          heroImage: setRes.data.heroImage || '',
          heroImagePublicId: setRes.data.heroImagePublicId || '',
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('makuma_token');
    localStorage.removeItem('makuma_admin');
    navigate('/admin/login');
  }

  // ─── Product Form ───
  const [productForm, setProductForm] = useState({
    name: '', category: '', categoryLabel: '', image: '', imagePublicId: '',
    badge: '', sizes: '', availableColors: '', description: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // ─── Category Form ───
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', image: '', imagePublicId: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadAPI.single(file);
      setProductForm({ ...productForm, image: res.data.url, imagePublicId: res.data.publicId });
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        availableColors: productForm.availableColors ? productForm.availableColors.split(',').map(s => s.trim()).filter(Boolean) : [],
        badge: productForm.badge || null,
      };
      
      if (editingProductId) {
        await productsAPI.update(editingProductId, data);
      } else {
        await productsAPI.create(data);
      }
      
      setShowAddProduct(false);
      setEditingProductId(null);
      setProductForm({ name: '', category: '', categoryLabel: '', image: '', imagePublicId: '', badge: '', sizes: '', availableColors: '', description: '' });
      loadData();
    } catch (err) {
      setError('Failed to save product: ' + err.message);
    }
  }

  function handleEditProduct(product) {
    setEditingProductId(product._id || product.id);
    setProductForm({
      name: product.name || '',
      category: product.category._id || product.category,
      categoryLabel: product.categoryLabel || '',
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
      badge: product.badge || '',
      sizes: product.sizes ? product.sizes.join(', ') : '',
      availableColors: product.availableColors ? product.availableColors.join(', ') : '',
      description: product.description || ''
    });
    setShowAddProduct(true);
    setTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        await categoriesAPI.update(editingCategoryId, categoryForm);
      } else {
        await categoriesAPI.create(categoryForm);
      }
      setShowAddCategory(false);
      setEditingCategoryId(null);
      setCategoryForm({ name: '', slug: '', image: '', imagePublicId: '' });
      loadData();
    } catch (err) {
      setError('Failed to save category: ' + err.message);
    }
  }

  function handleEditCategory(cat) {
    setEditingCategoryId(cat._id || cat.id);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      image: cat.image || '',
      imagePublicId: cat.imagePublicId || ''
    });
    setShowAddCategory(true);
    setTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCategoryImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCategoryImage(true);
    try {
      const res = await uploadAPI.single(file);
      setCategoryForm({ ...categoryForm, image: res.data.url, imagePublicId: res.data.publicId });
    } catch (err) {
      setError('Category image upload failed: ' + err.message);
    } finally {
      setUploadingCategoryImage(false);
    }
  }

  async function handleHeroImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingHeroImage(true);
    try {
      const res = await uploadAPI.single(file);
      setSettingsForm({ ...settingsForm, heroImage: res.data.url, heroImagePublicId: res.data.publicId });
    } catch (err) {
      setError('Hero image upload failed: ' + err.message);
    } finally {
      setUploadingHeroImage(false);
    }
  }

  async function handleLookbookImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLookbookImage(true);
    try {
      const res = await uploadAPI.single(file);
      setLookbookForm({ ...lookbookForm, image: res.data.url, imagePublicId: res.data.publicId });
    } catch (err) {
      setError('Lookbook image upload failed: ' + err.message);
    } finally {
      setUploadingLookbookImage(false);
    }
  }

  async function handleAddLookbook(e) {
    e.preventDefault();
    try {
      await lookbookAPI.create(lookbookForm);
      setShowAddLookbook(false);
      setLookbookForm({ title: '', image: '', imagePublicId: '', category: '' });
      loadData();
    } catch (err) {
      setError('Failed to save lookbook item: ' + err.message);
    }
  }

  function requestDeleteLookbook(id) {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Lookbook Item',
      message: 'Are you sure you want to delete this lookbook image?',
      onConfirm: () => handleDeleteLookbook(id)
    });
  }

  async function handleDeleteLookbook(id) {
    try {
      await lookbookAPI.delete(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  function requestDeleteProduct(id) {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: () => handleDeleteProduct(id)
    });
  }

  function requestDeleteCategory(id) {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? Products within this category might be affected.',
      onConfirm: () => handleDeleteCategory(id)
    });
  }

  async function handleDeleteProduct(id) {
    try {
      await productsAPI.delete(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await categoriesAPI.delete(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateInquiryStatus(id, status) {
    try {
      await inquiriesAPI.updateStatus(id, status);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsAPI.update(settingsForm);
      setError('');
      alert('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.85rem', color: '#555' };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f9f9f9' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '4px' }}>Admin Dashboard</h1>
            <p style={{ color: '#888' }}>Welcome, {admin.username || 'Admin'}</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Logout
          </button>
        </div>

        {error && (
          <div style={{ background: '#fff1f0', border: '1px solid #ffccc7', color: '#cf1322', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '0.9rem' }}>
            {error}
            <button onClick={() => setError('')} style={{ float: 'right', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.1rem' }}>×</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Products', value: products.length, color: '#000' },
            { label: 'Categories', value: categories.length, color: 'var(--accent)' },
            { label: 'New Inquiries', value: inquiries.filter(i => i.status === 'new').length, color: '#52c41a' },
            { label: 'Total Inquiries', value: inquiries.length, color: '#1890ff' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
          {['products', 'inquiries', 'categories', 'lookbook', 'content'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: '4px', background: tab === t ? '#000' : '#fff', color: tab === t ? '#fff' : '#555', cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Products ({products.length})</h2>
              <button onClick={() => setShowAddProduct(!showAddProduct)} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showAddProduct && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAddProduct} style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eaeaea', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={labelStyle}>Product Name *</label><input name="name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required style={inputStyle} /></div>
                
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select 
                    name="category" 
                    value={productForm.category} 
                    onChange={(e) => {
                      const selectedCat = categories.find(c => c._id === e.target.value);
                      setProductForm({ 
                        ...productForm, 
                        category: e.target.value,
                        categoryLabel: selectedCat ? selectedCat.name : ''
                      });
                    }} 
                    required 
                    style={inputStyle}
                  >
                    <option value="">Select a Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div><label style={labelStyle}>Badge</label><select name="badge" value={productForm.badge} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} style={inputStyle}><option value="">None</option><option value="new">New</option><option value="trending">Trending</option><option value="bestseller">Bestseller</option></select></div>
                <div><label style={labelStyle}>Sizes (comma-separated)</label><input name="sizes" value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} style={inputStyle} placeholder="26, 28, 30, 32" /></div>
                <div><label style={labelStyle}>Colors (comma-separated)</label><input name="availableColors" value={productForm.availableColors} onChange={(e) => setProductForm({ ...productForm, availableColors: e.target.value })} style={inputStyle} placeholder="Light Wash, Dark Wash" /></div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Product Image *</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '0.9rem' }} />
                    {uploadingImage && <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Uploading...</span>}
                    {productForm.image && <img src={productForm.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Description</label><textarea name="description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows="3" style={{ ...inputStyle, resize: 'vertical' }} /></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" style={{ padding: '12px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                    {editingProductId ? 'Update Product' : 'Save Product'}
                  </button>
                  <button type="button" onClick={() => { setShowAddProduct(false); setEditingProductId(null); }} style={{ padding: '12px 32px', background: 'transparent', color: '#000', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginLeft: '12px' }}>
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            <div style={{ display: 'grid', gap: '12px' }}>
              {products.map((p) => (
                <div key={p._id || p.id} style={{ background: '#fff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #eaeaea', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {p.image && <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                      {p.categoryLabel}
                      {p.description && (
                        <span style={{ display: 'block', marginTop: '2px', color: '#555' }}>
                          {p.description.length > 80 ? p.description.substring(0, 80) + '...' : p.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {p.badge && <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', background: p.badge === 'trending' ? 'var(--accent)' : '#000', color: '#fff', textTransform: 'uppercase' }}>{p.badge}</span>}
                  <button onClick={() => handleEditProduct(p)} style={{ padding: '6px 14px', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                  <button onClick={() => requestDeleteProduct(p._id)} style={{ padding: '6px 14px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                </div>
              ))}
              {products.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No products yet. Add your first product above.</p>}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {tab === 'inquiries' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Wholesale Inquiries ({inquiries.length})</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {inquiries.map((inq) => (
                <div key={inq._id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{inq.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>{inq.business} · {inq.email || inq.phone}</div>
                    </div>
                    <select value={inq.status} onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem', background: inq.status === 'new' ? '#e6fffb' : '#fff' }}>
                      {['new', 'contacted', 'qualified', 'converted', 'closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  {inq.message && <p style={{ color: '#555', fontSize: '0.95rem', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>{inq.message}</p>}
                  <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '8px' }}>Interest: {inq.interest || 'N/A'} · Volume: {inq.volume || 'N/A'} · {new Date(inq.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
              {inquiries.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No inquiries received yet.</p>}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Categories ({categories.length})</h2>
              <button onClick={() => setShowAddCategory(!showAddCategory)} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {showAddCategory ? 'Cancel' : '+ Add Category'}
              </button>
            </div>

            {showAddCategory && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAddCategory} style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eaeaea', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={labelStyle}>Category Name *</label><input name="name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required style={inputStyle} placeholder="e.g. Wide Leg Jeans" /></div>
                <div><label style={labelStyle}>Slug *</label><input name="slug" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} required style={inputStyle} placeholder="e.g. wide-leg-jeans" /></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Category Image</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={handleCategoryImageUpload} style={{ fontSize: '0.9rem' }} />
                    {uploadingCategoryImage && <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Uploading...</span>}
                    {categoryForm.image && <img src={categoryForm.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" style={{ padding: '12px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                    {editingCategoryId ? 'Update Category' : 'Save Category'}
                  </button>
                  <button type="button" onClick={() => { setShowAddCategory(false); setEditingCategoryId(null); }} style={{ padding: '12px 32px', background: 'transparent', color: '#000', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginLeft: '12px' }}>
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {categories.map((cat) => (
                <div key={cat._id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    {cat.image && <img src={cat.image} alt={cat.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>Slug: {cat.slug}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '500' }}>{cat.productCount || 0} products</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditCategory(cat)} style={{ padding: '4px 10px', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                      <button onClick={() => requestDeleteCategory(cat._id)} style={{ padding: '4px 10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>No categories yet.</p>}
            </div>
          </div>
        )}

        {/* Lookbook Tab */}
        {tab === 'lookbook' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Lookbook ({lookbookItems.length})</h2>
              <button onClick={() => setShowAddLookbook(!showAddLookbook)} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {showAddLookbook ? 'Cancel' : '+ Add Lookbook Image'}
              </button>
            </div>

            {showAddLookbook && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAddLookbook} style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eaeaea', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={labelStyle}>Title *</label><input value={lookbookForm.title} onChange={(e) => setLookbookForm({ ...lookbookForm, title: e.target.value })} required style={inputStyle} placeholder="e.g. Summer Denim Look" /></div>
                <div><label style={labelStyle}>Category</label><input value={lookbookForm.category} onChange={(e) => setLookbookForm({ ...lookbookForm, category: e.target.value })} style={inputStyle} placeholder="e.g. Wide Leg Jeans" /></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Image *</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={handleLookbookImageUpload} style={{ fontSize: '0.9rem' }} />
                    {uploadingLookbookImage && <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Uploading...</span>}
                    {lookbookForm.image && <img src={lookbookForm.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" disabled={!lookbookForm.image} style={{ padding: '12px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: lookbookForm.image ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '1rem' }}>
                    Save Lookbook Image
                  </button>
                  <button type="button" onClick={() => setShowAddLookbook(false)} style={{ padding: '12px 32px', background: 'transparent', color: '#000', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginLeft: '12px' }}>
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {lookbookItems.map((item) => (
                <div key={item._id} style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</div>
                    {item.category && <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.category}</div>}
                  </div>
                  <button onClick={() => requestDeleteLookbook(item._id)} style={{ position: 'absolute', top: '8px', right: '8px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
              {lookbookItems.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>No lookbook images yet. Add your first one above.</p>}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {tab === 'content' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Website Content</h2>
            <form onSubmit={handleSaveSettings} style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eaeaea', display: 'grid', gap: '20px', maxWidth: '800px' }}>
              <div>
                <label style={labelStyle}>Hero Title</label>
                <input name="heroTitle" value={settingsForm.heroTitle} onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} style={inputStyle} placeholder="e.g. Redefining Ladies Denim" />
                <small style={{ color: '#888', fontSize: '0.8rem' }}>Use \n for new lines</small>
              </div>
              <div>
                <label style={labelStyle}>Hero Subtitle</label>
                <input name="heroSubtitle" value={settingsForm.heroSubtitle} onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })} style={inputStyle} placeholder="e.g. Surat's Premium Wholesaler" />
              </div>
              <div>
                <label style={labelStyle}>Hero Description</label>
                <textarea name="heroDescription" value={settingsForm.heroDescription} onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} />
              </div>
              <div>
                <label style={labelStyle}>Hero Image</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} style={{ fontSize: '0.9rem' }} />
                  {uploadingHeroImage && <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>Uploading...</span>}
                  {settingsForm.heroImage && <img src={settingsForm.heroImage} alt="Hero Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />}
                </div>
                <small style={{ color: '#888', fontSize: '0.8rem' }}>Upload the main hero section image</small>
              </div>
              <div>
                <button type="submit" disabled={savingSettings} style={{ padding: '12px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: savingSettings ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                  {savingSettings ? 'Saving...' : 'Save Content'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Confirm Modal Overlay */}
      {confirmModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '400px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '12px' }}>{confirmModal.title}</h3>
            <p style={{ color: '#555', marginBottom: '24px', lineHeight: '1.5' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setConfirmModal({ isOpen: false })} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({ isOpen: false }); }} style={{ padding: '8px 16px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

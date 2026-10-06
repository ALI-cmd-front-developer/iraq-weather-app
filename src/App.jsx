import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'https://jsonplaceholder.typicode.com'
const PAGE_SIZE = 8

const navigation = [
  { id: 'posts', label: 'المنشورات', icon: '▤' },
  { id: 'users', label: 'المستخدمون', icon: '◎' },
]

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function App() {
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCurrent = true

    async function loadData() {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          fetch(`${API_URL}/posts`),
          fetch(`${API_URL}/users`),
        ])

        if (!postsResponse.ok || !usersResponse.ok) {
          throw new Error('تعذّر تحميل البيانات من JSONPlaceholder.')
        }

        const [postsData, usersData] = await Promise.all([
          postsResponse.json(),
          usersResponse.json(),
        ])

        if (isCurrent) {
          setPosts(postsData)
          setUsers(usersData)
          setError('')
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'حدث خطأ غير متوقع أثناء تحميل البيانات.',
          )
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    loadData()
    return () => {
      isCurrent = false
    }
  }, [reloadKey])

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesUser =
        selectedUser === 'all' || String(post.userId) === selectedUser
      const matchesQuery =
        !normalizedQuery ||
        `${post.title} ${post.body}`.toLowerCase().includes(normalizedQuery)
      return matchesUser && matchesQuery
    })
  }, [posts, query, selectedUser])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return users.filter((user) =>
      `${user.name} ${user.username} ${user.email} ${user.company.name}`
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [users, query])

  const visiblePosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))

  function changeTab(tab) {
    setActiveTab(tab)
    setQuery('')
    setPage(1)
  }

  function updateQuery(value) {
    setQuery(value)
    setPage(1)
  }

  function updateUser(value) {
    setSelectedUser(value)
    setPage(1)
  }

  async function createPost(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newPost = {
      title: String(formData.get('title')).trim(),
      body: String(formData.get('body')).trim(),
      userId: Number(formData.get('userId')),
    }

    if (!newPost.title || !newPost.body || !newPost.userId) return

    setIsSaving(true)
    setNotice('')
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) throw new Error('لم ينجح إرسال المنشور. حاول مرة أخرى.')

      const savedPost = await response.json()
      setPosts((currentPosts) => [{ ...savedPost, isLocal: true }, ...currentPosts])
      setIsCreateOpen(false)
      setPage(1)
      setNotice('تم إرسال المنشور بنجاح — JSONPlaceholder يعرضه كتجربة فقط.')
    } catch (saveError) {
      setNotice(
        saveError instanceof Error
          ? saveError.message
          : 'حدث خطأ أثناء إرسال المنشور.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const currentTitle = activeTab === 'posts' ? 'مساحة المنشورات' : 'دليل المستخدمين'
  const currentDescription =
    activeTab === 'posts'
      ? 'استكشف المحتوى، ابحث فيه، وجرّب إرسال منشور جديد.'
      : 'تعرّف على المستخدمين وبياناتهم التجريبية.'

  return (
    <div className="app-shell" dir="rtl">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="نبض، الصفحة الرئيسية">
          <span className="brand-mark">ن</span>
          <span className="brand-copy">
            <strong>نبض</strong>
            <small>API playground</small>
          </span>
        </a>

        <div className="sidebar-label">مساحة العمل</div>
        <nav className="navigation" aria-label="التنقل الرئيسي">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => changeTab(item.id)}
              type="button"
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'posts' && <span className="nav-count">100</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-tip">
          <span className="tip-sparkle">✳</span>
          <strong>مساحة آمنة للتجربة</strong>
          <p>كل البيانات هنا تجريبية، جرّب براحتك بدون أي قلق.</p>
          <span className="tip-dots" aria-hidden="true">•••</span>
        </div>

        <div className="profile">
          <div className="profile-avatar">م</div>
          <div className="profile-copy">
            <strong>مطور الواجهة</strong>
            <span>وضع التجربة</span>
          </div>
          <span className="profile-menu" aria-hidden="true">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>مساحة العمل</span><b>/</b>{activeTab === 'posts' ? 'المنشورات' : 'المستخدمون'}</div>
          <div className="topbar-actions">
            <span className={`api-status ${error ? 'offline' : ''}`}>
              <span className="status-dot" />
              {error ? 'الاتصال متعذّر' : 'JSONPlaceholder متصل'}
            </span>
            <button
              className="icon-button refresh-button"
              onClick={() => {
                setLoading(true)
                setReloadKey((key) => key + 1)
              }}
              title="تحديث البيانات"
              aria-label="تحديث البيانات"
              type="button"
            >
              ↻
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-banner">
            <div className="welcome-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> مساحة تجريبية</span>
              <h1>أهلاً بك في <span>نبض.</span></h1>
              <p>واجهة بسيطة ولطيفة لتجربة البيانات الحقيقية من JSONPlaceholder.</p>
              <div className="welcome-actions">
                <button
                  className="button button-light"
                  onClick={() => activeTab === 'posts' ? setIsCreateOpen(true) : changeTab('posts')}
                  type="button"
                >
                  {activeTab === 'posts' ? <><span>＋</span> أنشئ منشوراً</> : <>استكشف المنشورات <span>←</span></>}
                </button>
                <span className="banner-caption"><span className="tiny-sparkle">✦</span> بيانات آمنة للتجربة</span>
              </div>
            </div>
            <div className="banner-art" aria-hidden="true">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-card art-card-back"><span>✦</span><i /><i /><i /></div>
              <div className="art-card art-card-front"><span className="art-card-icon">✳</span><b /><i /><i /><i /></div>
              <span className="art-star star-one">✦</span>
              <span className="art-star star-two">✧</span>
              <span className="art-spark">✳</span>
            </div>
            <div className="banner-decoration decoration-one" />
            <div className="banner-decoration decoration-two" />
          </section>

          <section className="stats-grid" aria-label="ملخص البيانات">
            <article className="stat-card">
              <span className="stat-icon posts-icon">▤</span>
              <div className="stat-info"><span>إجمالي المنشورات</span><strong>{loading ? '—' : posts.length}</strong></div>
              <span className="stat-trend">منشور تجريبي</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon users-icon">◎</span>
              <div className="stat-info"><span>المستخدمون</span><strong>{loading ? '—' : users.length}</strong></div>
              <span className="stat-trend">حساب تجريبي</span>
            </article>
            <article className="stat-card">
              <span className="stat-icon api-icon">⌘</span>
              <div className="stat-info"><span>مصدر البيانات</span><strong className="api-name">REST API</strong></div>
              <span className="stat-trend">jsonplaceholder</span>
            </article>
          </section>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <div className="section-title-row"><h2>{currentTitle}</h2><span className="results-count">{activeTab === 'posts' ? filteredPosts.length : filteredUsers.length}</span></div>
                <p>{currentDescription}</p>
              </div>
              {activeTab === 'posts' && (
                <button className="button button-primary" onClick={() => setIsCreateOpen(true)} type="button">
                  <span>＋</span> منشور جديد
                </button>
              )}
            </div>

            <div className="toolbar">
              <label className="search-field">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder={activeTab === 'posts' ? 'ابحث في المنشورات...' : 'ابحث عن مستخدم...'}
                  aria-label={activeTab === 'posts' ? 'ابحث في المنشورات' : 'ابحث عن مستخدم'}
                />
                <kbd>⌘ K</kbd>
              </label>
              {activeTab === 'posts' && (
                <label className="select-wrap">
                  <span className="filter-icon" aria-hidden="true">☷</span>
                  <select value={selectedUser} onChange={(event) => updateUser(event.target.value)} aria-label="تصفية حسب الكاتب">
                    <option value="all">كل الكتّاب</option>
                    {users.map((user) => <option key={user.id} value={String(user.id)}>{user.name}</option>)}
                  </select>
                  <span className="select-chevron">⌄</span>
                </label>
              )}
              <span className="toolbar-meta">{activeTab === 'posts' ? 'آخر التحديثات' : 'دليل المجتمع'} <span className="meta-dot">·</span> {activeTab === 'posts' ? '100 منشور' : '10 مستخدمين'}</span>
            </div>

            {notice && (
              <div className={`notice ${notice.includes('لم ينجح') || notice.includes('خطأ') ? 'notice-error' : ''}`} role="status">
                <span>{notice.includes('نجاح') || notice.includes('بنجاح') ? '✓' : '!'}</span>{notice}
                <button type="button" onClick={() => setNotice('')} aria-label="إغلاق التنبيه">×</button>
              </div>
            )}

            {error ? (
              <div className="state-panel error-panel">
                <span className="state-icon">!</span>
                <h3>ما قدرنا نوصل للبيانات</h3>
                <p>{error} تأكد من اتصال الإنترنت ثم حاول مرة أخرى.</p>
                <button className="button button-primary" onClick={() => { setLoading(true); setReloadKey((key) => key + 1) }} type="button">حاول مرة ثانية</button>
              </div>
            ) : loading ? (
              activeTab === 'posts' ? (
                <div className="posts-grid" aria-label="جاري تحميل المنشورات">
                  {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><span /><span /><span /><span /></div>)}
                </div>
              ) : (
                <div className="users-grid" aria-label="جاري تحميل المستخدمين">
                  {Array.from({ length: 6 }, (_, index) => <div className="skeleton-user" key={index}><span /><i /><i /></div>)}
                </div>
              )
            ) : activeTab === 'posts' ? (
              <>
                {visiblePosts.length ? (
                  <div className="posts-grid">
                    {visiblePosts.map((post, index) => {
                      const author = users.find((user) => user.id === post.userId)
                      return (
                        <article className="post-card" key={`${post.id}-${post.isLocal ? 'local' : 'api'}`}>
                          <div className="post-card-top">
                            <span className={`post-category category-${(post.userId - 1) % 5}`}>{['إلهام', 'أفكار', 'يوميات', 'اكتشاف', 'مجتمع'][(post.userId - 1) % 5] ?? 'إلهام'}</span>
                            <button className="more-button" type="button" aria-label="خيارات المنشور">•••</button>
                          </div>
                          <button className="post-title-button" onClick={() => setSelectedPost(post)} type="button">{post.title}</button>
                          <p className="post-excerpt">{post.body}</p>
                          <div className="post-card-footer">
                            <div className={`author-avatar avatar-${(post.userId - 1) % 5}`}>{getInitials(author?.name ?? 'مستخدم')}</div>
                            <div className="author-info"><strong>{author?.name ?? 'مستخدم جديد'}</strong><span>{post.isLocal ? 'الآن · منشور تجريبي' : `منشور #${post.id}`}</span></div>
                            <button className="open-post" onClick={() => setSelectedPost(post)} type="button" aria-label={`عرض منشور ${post.title}`}>↗</button>
                          </div>
                          {index === 0 && post.isLocal && <span className="new-tag">جديد</span>}
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="state-panel empty-panel"><span className="state-icon">⌕</span><h3>ما لقينا نتائج</h3><p>جرّب كلمة ثانية أو غيّر فلتر الكاتب.</p><button className="text-button" onClick={() => { updateQuery(''); updateUser('all') }} type="button">مسح الفلاتر</button></div>
                )}
                {filteredPosts.length > PAGE_SIZE && (
                  <div className="pagination">
                    <span>عرض <b>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredPosts.length)}</b> من <b>{filteredPosts.length}</b> منشور</span>
                    <div className="pagination-controls">
                      <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} type="button" aria-label="الصفحة السابقة">→</button>
                      <span>صفحة <b>{page}</b> من {pageCount}</span>
                      <button onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} type="button" aria-label="الصفحة التالية">←</button>
                    </div>
                  </div>
                )}
              </>
            ) : filteredUsers.length ? (
              <div className="users-grid">
                {filteredUsers.map((user, index) => (
                  <article className="user-card" key={user.id}>
                    <div className={`user-avatar avatar-${index % 5}`}>{getInitials(user.name)}</div>
                    <span className="user-number">0{user.id}</span>
                    <h3>{user.name}</h3>
                    <span className="user-handle">@{user.username}</span>
                    <div className="user-details"><span>✉</span>{user.email}<span className="detail-divider" /><span>⌖</span>{user.address.city}</div>
                    <div className="user-company"><span className="company-dot" />{user.company.name}</div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="state-panel empty-panel"><span className="state-icon">⌕</span><h3>ما لقينا مستخدمين</h3><p>جرّب البحث باسم أو بريد مختلف.</p><button className="text-button" onClick={() => updateQuery('')} type="button">مسح البحث</button></div>
            )}
          </section>

          <footer className="page-footer"><span>صُنع للتجربة، لا أكثر <span className="footer-heart">♥</span></span><span>البيانات مقدّمة من <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noreferrer">JSONPlaceholder ↗</a></span></footer>
        </div>
      </main>

      {selectedPost && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPost(null) }} role="presentation">
          <section className="dialog post-dialog" role="dialog" aria-modal="true" aria-labelledby="post-dialog-title">
            <button className="dialog-close" onClick={() => setSelectedPost(null)} type="button" aria-label="إغلاق">×</button>
            <span className="post-category category-1">منشور #{selectedPost.id}</span>
            <h2 id="post-dialog-title">{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
            <div className="dialog-author"><div className="author-avatar">{getInitials(users.find((user) => user.id === selectedPost.userId)?.name ?? 'مستخدم')}</div><div><strong>{users.find((user) => user.id === selectedPost.userId)?.name ?? 'مستخدم'}</strong><span>كاتب المنشور</span></div></div>
          </section>
        </div>
      )}

      {isCreateOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setIsCreateOpen(false) }} role="presentation">
          <form className="dialog create-dialog" onSubmit={createPost} aria-labelledby="create-dialog-title">
            <button className="dialog-close" onClick={() => setIsCreateOpen(false)} type="button" aria-label="إغلاق" disabled={isSaving}>×</button>
            <span className="dialog-eyebrow">تجربة JSONPlaceholder</span>
            <h2 id="create-dialog-title">منشور جديد</h2>
            <p className="dialog-description">أرسل منشوراً تجريبياً إلى واجهة JSONPlaceholder.</p>
            <label className="form-label">عنوان المنشور<input name="title" placeholder="اكتب عنواناً واضحاً..." required maxLength={120} /></label>
            <label className="form-label">المحتوى<textarea name="body" placeholder="شارك فكرة أو اكتب شيئاً..." required rows={4} maxLength={500} /></label>
            <label className="form-label">الكاتب<select name="userId" required defaultValue={users[0]?.id ?? ''}>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
            <div className="form-actions"><button className="button button-quiet" onClick={() => setIsCreateOpen(false)} type="button" disabled={isSaving}>إلغاء</button><button className="button button-primary" type="submit" disabled={isSaving}>{isSaving ? 'جارٍ الإرسال...' : 'إرسال المنشور'} <span>↗</span></button></div>
            <span className="dialog-note">ملاحظة: الـAPI تجريبي ولن يحفظ المنشور بشكل دائم.</span>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
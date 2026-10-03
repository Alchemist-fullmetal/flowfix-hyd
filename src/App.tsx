import { useMemo, useState } from 'react'

type Issue = {
  id: number
  title: string
  area: string
  category: 'Road' | 'Water' | 'Waste' | 'Streetlight'
  status: 'Reported' | 'Assigned' | 'Fixed'
  votes: number
  description: string
}

const seed: Issue[] = [
  { id: 1, title: 'Large pothole near Metro pillar', area: 'Uppal', category: 'Road', status: 'Assigned', votes: 42, description: 'Deep pothole causing traffic to slow down during peak hours.' },
  { id: 2, title: 'Overflowing public bin', area: 'Habsiguda', category: 'Waste', status: 'Reported', votes: 27, description: 'Waste has not been collected for two days.' },
  { id: 3, title: 'Broken streetlight', area: 'Tarnaka', category: 'Streetlight', status: 'Fixed', votes: 18, description: 'Streetlight was not functioning near the bus stop.' },
]

export default function App() {
  const [issues, setIssues] = useState(seed)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ title: '', area: '', category: 'Road', description: '' })

  const shown = useMemo(() => issues.filter(i =>
    (filter === 'All' || i.status === filter) &&
    (i.title + i.area + i.category).toLowerCase().includes(query.toLowerCase())
  ), [issues, filter, query])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.area.trim()) return
    const next: Issue = {
      id: Date.now(), title: form.title, area: form.area,
      category: form.category as Issue['category'],
      status: 'Reported', votes: 0, description: form.description
    }
    setIssues([next, ...issues])
    setForm({ title: '', area: '', category: 'Road', description: '' })
  }

  function vote(id: number) {
    setIssues(issues.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i))
  }

  return (
    <main>
      <header className="hero">
        <div>
          <span className="eyebrow">Civic issue reporting</span>
          <h1>FlowFix HYD</h1>
          <p>Report, track and verify neighborhood issues across Hyderabad.</p>
        </div>
        <div className="score"><strong>{issues.length}</strong><span>issues tracked</span></div>
      </header>

      <section className="toolbar">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search area or issue..." />
        <div className="filters">
          {['All','Reported','Assigned','Fixed'].map(x =>
            <button className={filter === x ? 'active' : ''} onClick={() => setFilter(x)} key={x}>{x}</button>
          )}
        </div>
      </section>

      <section className="layout">
        <div className="feed">
          {shown.map(issue => (
            <article className="card" key={issue.id}>
              <div className="cardtop">
                <span className="pill">{issue.category}</span>
                <span className={`status ${issue.status.toLowerCase()}`}>{issue.status}</span>
              </div>
              <h2>{issue.title}</h2>
              <p className="area">{issue.area}, Hyderabad</p>
              <p>{issue.description}</p>
              <div className="actions">
                <button onClick={() => vote(issue.id)}>▲ {issue.votes}</button>
                <span>Issue #{issue.id.toString().slice(-5)}</span>
              </div>
            </article>
          ))}
        </div>

        <form className="report" onSubmit={submit}>
          <h2>Report an issue</h2>
          <label>Title<input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="What happened?" /></label>
          <label>Area<input value={form.area} onChange={e => setForm({...form,area:e.target.value})} placeholder="Uppal, Habsiguda..." /></label>
          <label>Category
            <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
              <option>Road</option><option>Water</option><option>Waste</option><option>Streetlight</option>
            </select>
          </label>
          <label>Description<textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Add useful details..." /></label>
          <button className="primary">Submit report</button>
        </form>
      </section>
    </main>
  )
}

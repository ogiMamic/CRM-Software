import { useState } from 'react'

export default function SubscriberForm({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [contactType, setContactType] = useState('organic')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, contact_type: contactType })
    setEmail('')
    setContactType('organic')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
        className="mr-2 p-2 border rounded"
      />
      <select
        value={contactType}
        onChange={(e) => setContactType(e.target.value)}
        className="mr-2 p-2 border rounded"
      >
        <option value="organic">Organic</option>
        <option value="campaign">Campaign</option>
        <option value="imported">Imported</option>
      </select>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Add Subscriber
      </button>
    </form>
  )
}
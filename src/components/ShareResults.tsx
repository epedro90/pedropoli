import { useState } from 'react'
import { formatResultsText, type ShareData } from '../utils/shareText'
import { generateResultsImage, downloadBlob } from '../utils/shareCanvas'
import styles from './ShareResults.module.css'

interface Props {
  data: ShareData
}

export default function ShareResults({ data }: Props) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopy = async () => {
    const text = formatResultsText(data)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await generateResultsImage(data)
      if (blob) {
        const slug = data.gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const ts = new Date().toISOString().slice(0, 10)
        downloadBlob(blob, `pedropoli-${slug}-${ts}.png`)
      }
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={styles.row}>
      <button
        className={[styles.btn, copied ? styles.success : ''].filter(Boolean).join(' ')}
        onClick={handleCopy}
        aria-label="Copia il risultato negli appunti"
      >
        {copied ? '✓ Copiato!' : '📋 Copia testo'}
      </button>
      <button
        className={styles.btn}
        onClick={handleDownload}
        disabled={downloading}
        aria-label="Scarica il risultato come immagine"
      >
        {downloading ? '⏳ Generando…' : '📥 Scarica immagine'}
      </button>
    </div>
  )
}

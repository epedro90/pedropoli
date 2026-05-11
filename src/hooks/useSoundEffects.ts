import { useCallback, useRef } from 'react'
import { isMuted } from './useSoundMuted'

export type SoundName = 'success' | 'error' | 'click' | 'reveal' | 'applause'

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  return new Ctx()
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback((): AudioContext | null => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = getAudioContext()
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const play = useCallback((name: SoundName) => {
    if (isMuted()) return
    const ctx = getCtx()
    if (!ctx) return
    const t0 = ctx.currentTime

    if (name === 'success') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, t0)
      osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.18)
      gain.gain.setValueAtTime(0.2, t0)
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + 0.25)
      return
    }

    if (name === 'error') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(330, t0)
      osc.frequency.exponentialRampToValueAtTime(110, t0 + 0.22)
      gain.gain.setValueAtTime(0.18, t0)
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.26)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + 0.28)
      return
    }

    if (name === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(1000, t0)
      gain.gain.setValueAtTime(0.08, t0)
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + 0.05)
      return
    }

    if (name === 'reveal') {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      osc1.type = 'sine'
      osc2.type = 'sine'
      osc1.frequency.setValueAtTime(600, t0)
      osc2.frequency.setValueAtTime(1200, t0)
      gain.gain.setValueAtTime(0.12, t0)
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18)
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      osc1.start(t0); osc2.start(t0)
      osc1.stop(t0 + 0.2); osc2.stop(t0 + 0.2)
      return
    }

    if (name === 'applause') {
      // White noise + lowpass + envelope to approximate clapping
      const duration = 1.6
      const bufferSize = Math.floor(ctx.sampleRate * duration)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, t0)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.001, t0)
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.6)
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)

      source.connect(filter).connect(gain).connect(ctx.destination)
      source.start(t0)
      source.stop(t0 + duration)
      return
    }
  }, [getCtx])

  return { play }
}

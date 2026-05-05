import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
  glow?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  glow = false,
  className = '',
  ...props
}: Props) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    glow ? styles.glow : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      <span className={styles.inner}>{children}</span>
    </button>
  )
}

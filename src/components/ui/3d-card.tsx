import React, { createContext, useContext, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const MouseEnterContext = createContext<
  readonly [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 25
    const y = (e.clientY - top - height / 2) / 25
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => setIsMouseEntered(true)
  const handleMouseLeave = () => {
    setIsMouseEntered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn('py-4 flex items-center justify-center', containerClassName)}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateY: isMouseEntered ? mousePosition.x : 0,
            rotateX: isMouseEntered ? -mousePosition.y : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
          className={cn('flex items-center justify-center relative transition-all duration-200 ease-linear', className)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children}
        </motion.div>
      </div>
    </MouseEnterContext.Provider>
  )
}

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn('h-full w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]', className)}
    >
      {children}
    </div>
  )
}

export const CardItem = ({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: any
  children: React.ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
} & React.HTMLAttributes<HTMLElement>) => {
  const context = useContext(MouseEnterContext)
  if (context === undefined) {
    throw new Error('CardItem must be used within a CardContainer')
  }
  const [isMouseEntered] = context

  return (
    <Tag
      className={cn('transition duration-200 ease-linear', className)}
      style={{
        transform: isMouseEntered
          ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
          : 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

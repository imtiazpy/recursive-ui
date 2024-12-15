import { useState, useCallback } from 'react'

const COLORS = [
  'bg-fuchsia-500', 'bg-purple-900', 'bg-emerald-500', 'bg-lime-400',
  'bg-purple-600', 'bg-orange-400', 'bg-pink-500', 'bg-indigo-600',
  'bg-teal-400', 'bg-yellow-400', 'bg-red-500', 'bg-blue-500',
]

type Split = {
  direction: 'vertical' | 'horizontal' | null
  children: Split[]
  color: string
}

type SplitScreenProps = {
  initialColor?: string
  onRemove?: () => void
}

export default function RecursiveSplitScreen({ initialColor, onRemove }: SplitScreenProps) {
  const getRandomColor = useCallback(() => {
    return COLORS[Math.floor(Math.random() * COLORS.length)]
  }, [])
  
  const [split, setSplit] = useState<Split>({ 
    direction: null, 
    children: [], 
    color: initialColor || getRandomColor() 
  })

  const handleSplit = (type: 'vertical' | 'horizontal') => {
    if (split.direction === null) {
      setSplit({
        direction: type,
        children: [
          { direction: null, children: [], color: split.color },
          { direction: null, children: [], color: getRandomColor() }
        ],
        color: split.color
      })
    }
  }


  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    } 
  }

  if (split.direction === null) {
    return (
      <div className={`w-full h-full relative ${split.color}`}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex">
          <button 
            className="btn-primary"
            onClick={() => handleSplit('vertical')}
          >
            v
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleSplit('horizontal')}
          >
            h
          </button>
          <button 
            className="btn-primary"
            onClick={handleRemove}
          >
            -
          </button>
        </div>
      </div>
    )
  }

  const handleChildRemove = (index: number) => {
    setSplit(prevSplit => ({
      ...prevSplit,
      direction: null,
      children: [],
      color: prevSplit.children[index].color
    }))
  }

  // const handleChildRemove = (index: number) => {
  //   setSplit(prevSplit => {
  //     const otherIndex = index === 0 ? 1 : 0;
  //     return {
  //       direction: null,
  //       children: [],
  //       color: prevSplit.children[otherIndex].color
  //     };
  //   });
  // };

  return (
    <div className={`w-full h-full flex ${split.direction === 'vertical' ? 'flex-row' : 'flex-col'} gap-1 bg-black`}>
      {split.children.map((child, index) => (
        <div 
          key={index} 
          className={`flex-1`}
        >
          <RecursiveSplitScreen 
            initialColor={child.color} 
            onRemove={() => handleChildRemove(index)}
          />
        </div>
      ))}
    </div>
  )
}


interface CountdownTimerProps {
  countdown: number
}

export default function CountdownTimer({ countdown }: CountdownTimerProps) {
  return (
    <div className="mt-6 p-4 bg-yellow-50 rounded-xl text-center">
      <h4 className="font-medium mb-2 text-yellow-800">Revealing in...</h4>
      <div className="text-6xl font-bold text-yellow-600">
        {countdown}
      </div>
    </div>
  )
}

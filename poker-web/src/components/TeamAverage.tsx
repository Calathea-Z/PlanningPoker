interface TeamAverageProps {
  average: number
}

export default function TeamAverage({ average }: TeamAverageProps) {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
      <h4 className="font-medium mb-2 text-blue-800">Team Average</h4>
      <div className="text-2xl font-bold text-blue-600">
        {average}
      </div>
    </div>
  )
}

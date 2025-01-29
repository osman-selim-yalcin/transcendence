import Leaderboard from "../components/Leaderboard/Leaderboard.tsx"

export default function Home() {
  return (
    <div>
      <h1>
        42 Transcendence by <i>bmat&osyalcin</i>
      </h1>
      <Leaderboard />
      <div className="flex gap-2 mt-5 mx-5">
        <div className="size-10 bg-blue-950 "></div>
        <div className="size-10 bg-blue-900 "></div>
        <div className="size-10 bg-blue-800 "></div>
        <div className="size-10 bg-blue-700 "></div>
        <div className="size-10 bg-blue-600 "></div>
        <div className="size-10 bg-blue-500 "></div>
        <div className="size-10 bg-blue-400 "></div>
      </div>
      <div className="flex gap-2 mt-5 mx-5">
        <div className="size-10 bg-blue-950 "></div>
        <div className="size-10 bg-blue-900 "></div>
        <div className="size-10 bg-blue-800 "></div>
        <div className="size-10 bg-blue-700 "></div>
        <div className="size-10 bg-blue-600 "></div>
        <div className="size-10 bg-blue-500 "></div>
        <div className="size-10 bg-blue-400 "></div>
      </div>
    </div>
  )
}

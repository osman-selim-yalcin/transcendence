export default function First() {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <img
        src="/gameplay.gif"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <h1 className="relative text-white text-5xl font-bold drop-shadow-lg">
        We are <p className="">CodeCapital</p>
      </h1>
    </div>
  )
}

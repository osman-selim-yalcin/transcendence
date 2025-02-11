export default function AboutUs() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full  p-8 gap-8">
      <div className="w-full md:w-1/2 bg-gradient-to-r from-purple-800 to-purple-900 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Who We Are
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-purple-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Osman Selim Yalçın</h3>
            <p className="text-sm text-purple-300">
              Senior Full-Stack Developer, DevOps Engineer, C/C++ Developer, AI
              Enthusiast
            </p>
          </div>
          <div className="p-4 bg-purple-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Burak Mat</h3>
            <p className="text-sm text-purple-300">
              Senior Full-Stack Developer, DevOps Engineer, C/C++ Developer, AI
              Enthusiast
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Our Passion
        </h2>
        <p className="text-md leading-relaxed">
          We are two passionate computer engineers who specialize in full-stack
          development, DevOps, and system architecture. Our expertise includes
          C/C++, Python, JavaScript, AI/LLM models, and cloud computing. We love
          building scalable web applications, developing real-time systems, and
          experimenting with game development and AI technologies. Our goal is
          to push technological boundaries and build innovative solutions that
          make a difference.
        </p>
      </div>
    </div>
  )
}

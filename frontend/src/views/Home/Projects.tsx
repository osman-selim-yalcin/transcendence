export default function Projects() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full  p-8 gap-8 bg-[#1a0536] text-white">
      {/* Left Side - Project Cards */}
      <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project 1 - Minishell */}
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold">Minishell</h3>
          <p className="text-sm text-purple-300">
            A small Unix shell implementation in C, showcasing deep
            understanding of Linux system calls, process management, and shell
            scripting basics.
          </p>
          <p className="text-xs text-purple-400">Tech Used: C, Linux Basics</p>
          <div className="mt-4 flex justify-between">
            <a
              target="_blank"
              href="https://github.com/burakmat/minishell"
              className="text-purple-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Project 2 - Raycasting Game */}
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold">Cub3D - Raycasting Game</h3>
          <p className="text-sm text-purple-300">
            A game developed in C using Raycasting technology, implementing
            mathematical algorithms for 3D rendering, player movement, and
            environment interaction.
          </p>
          <p className="text-xs text-purple-400">Tech Used: C, Math</p>
          <div className="mt-4 flex justify-between">
            <a
              target="_blank"
              href="https://github.com/osman-selim-yalcin/cub3d"
              className="text-purple-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Project 3 - University Professor Site */}
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold">
            University Professor Website
          </h3>
          <p className="text-sm text-purple-300">
            A professional website designed for a university professor,
            featuring dynamic content management, research publications, and
            academic resources.
          </p>
          <p className="text-xs text-purple-400">
            Tech Used: Flask, Docker, Nginx, Bootstrap
          </p>
          <div className="mt-4 flex justify-between">
            <a
              target="_blank"
              href="https://topculab.com/"
              className="text-purple-400 hover:underline"
            >
              Visit Site
            </a>
          </div>
        </div>

        {/* Project 4 - Transcendence Website */}
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold">Transcendence</h3>
          <p className="text-sm text-purple-300">
            A full-stack platform featuring an online game system, chat system,
            and user management. Built with a microservices architecture and
            real-time interactions.
          </p>
          <p className="text-xs text-purple-400">
            Tech Used: React, NestJS, PostgreSQL, Tailwind, Docker, Socket.IO
          </p>
          <div className="mt-4 flex justify-between">
            <a
              target="_blank"
              href="https://github.com/osman-selim-yalcin/transcendence"
              className="text-purple-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Description */}
      <div className="w-full md:w-1/3 bg-purple-800 p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Work</h2>
        <p className="text-md text-purple-300 leading-relaxed">
          We build scalable applications, AI-powered tools, and real-time
          multiplayer games. Our projects focus on innovation, performance, and
          user experience.
        </p>
        <a
          target="_blank"
          href="https://github.com/osman-selim-yalcin"
          className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-md me-3"
        >
          Osman Yalçın
        </a>
        <a
          target="_blank"
          href="https://github.com/burakmat"
          className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-md"
        >
          Burak Mat
        </a>
      </div>
    </div>
  )
}

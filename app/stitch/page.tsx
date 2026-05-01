"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StitchProject {
  id: string;
  projectId: string;
}

interface StitchScreen {
  id: string;
  screenId: string;
  projectId: string;
  imageUrl: string | null;
  htmlUrl: string | null;
}

export default function StitchDashboard() {
  const [projects, setProjects] = useState<StitchProject[]>([]);
  const [screens, setScreens] = useState<StitchScreen[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [deviceType, setDeviceType] = useState<"DESKTOP" | "MOBILE" | "TABLET" | "AGNOSTIC">("DESKTOP");
  const [previewScreen, setPreviewScreen] = useState<StitchScreen | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoadingProjects(true);
    setError(null);
    try {
      const res = await fetch("/api/stitch/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.error || "Failed to load projects");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoadingProjects(false);
    }
  }

  async function loadScreens(projectId: string) {
    setLoadingScreens(true);
    setScreens([]);
    setError(null);
    try {
      const res = await fetch(`/api/stitch/screens?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) {
        setScreens(data.screens);
        setSelectedProject(projectId);
      } else {
        setError(data.error || "Failed to load screens");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoadingScreens(false);
    }
  }

  async function generateScreen() {
    if (!selectedProject || !prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/stitch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          prompt: prompt.trim(),
          deviceType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScreens((prev) => [data.screen, ...prev]);
        setPrompt("");
      } else {
        setError(data.error || "Generation failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: "#1A1A1A", color: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#C5A572" }}
        >
          Stitch Design Studio
        </motion.h1>
        <p className="text-gray-400 mb-8">
          Browse and generate UI designs directly from Google Stitch.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-200"
          >
            {error}
          </motion.div>
        )}

        {/* Projects */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Projects</h2>
          {loadingProjects ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-[#C5A572] border-t-transparent rounded-full animate-spin" />
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-gray-500">
              No projects found. Make sure your <code className="bg-[#0D0D0D] px-1 rounded">STITCH_API_KEY</code> is set.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => loadScreens(project.projectId)}
                  className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                    selectedProject === project.projectId
                      ? "bg-[#C5A572] text-[#1A1A1A] border-[#C5A572]"
                      : "bg-[#0D0D0D] text-gray-300 border-gray-700 hover:border-[#C5A572] hover:text-white"
                  }`}
                >
                  {project.projectId}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Generate */}
        <AnimatePresence>
          {selectedProject && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 overflow-hidden"
            >
              <h2 className="text-xl font-semibold mb-4 text-white">Generate New Screen</h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateScreen()}
                  placeholder="Describe the UI you want to generate..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[#0D0D0D] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A572]"
                />
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value as typeof deviceType)}
                  className="px-4 py-3 rounded-lg bg-[#0D0D0D] border border-gray-700 text-white focus:outline-none focus:border-[#C5A572]"
                >
                  <option value="DESKTOP">Desktop</option>
                  <option value="MOBILE">Mobile</option>
                  <option value="TABLET">Tablet</option>
                  <option value="AGNOSTIC">Agnostic</option>
                </select>
                <button
                  onClick={generateScreen}
                  disabled={generating || !prompt.trim()}
                  className="px-6 py-3 rounded-lg bg-[#C5A572] text-[#1A1A1A] font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {generating && (
                    <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                  )}
                  {generating ? "Generating..." : "Generate"}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Screens */}
        {selectedProject && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Screens ({screens.length})
            </h2>
            {loadingScreens ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-[#C5A572] border-t-transparent rounded-full animate-spin" />
                Loading screens...
              </div>
            ) : screens.length === 0 ? (
              <div className="text-gray-500">No screens in this project yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {screens.map((screen) => (
                  <motion.div
                    key={screen.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl overflow-hidden border border-gray-800 bg-[#0D0D0D] hover:border-[#C5A572] transition-colors cursor-pointer group"
                    onClick={() => setPreviewScreen(screen)}
                  >
                    <div className="aspect-[4/3] bg-[#141414] relative overflow-hidden">
                      {screen.imageUrl ? (
                        <img
                          src={screen.imageUrl}
                          alt={`Screen ${screen.screenId}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                          No preview
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 font-mono truncate">
                        {screen.screenId}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {screen.htmlUrl && (
                          <a
                            href={screen.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:bg-[#C5A572] hover:text-[#1A1A1A] transition-colors"
                          >
                            Open HTML
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewScreen(screen);
                          }}
                          className="text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:bg-[#C5A572] hover:text-[#1A1A1A] transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewScreen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden border border-gray-800 bg-[#0D0D0D]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm text-gray-400 font-mono truncate max-w-[60%]">
                  {previewScreen.screenId}
                </span>
                <div className="flex gap-2">
                  {previewScreen.htmlUrl && (
                    <a
                      href={previewScreen.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded bg-[#C5A572] text-[#1A1A1A] font-medium hover:brightness-110 transition-all"
                    >
                      Open HTML
                    </a>
                  )}
                  <button
                    onClick={() => setPreviewScreen(null)}
                    className="text-xs px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="overflow-auto max-h-[calc(90vh-60px)]">
                {previewScreen.imageUrl ? (
                  <img
                    src={previewScreen.imageUrl}
                    alt={`Screen ${previewScreen.screenId}`}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No preview available
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

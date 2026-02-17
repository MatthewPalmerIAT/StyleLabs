using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Personal.Pages.Showcase
{
    public class GetCodeModel : PageModel
    {
        private readonly IWebHostEnvironment _env;

        public GetCodeModel(IWebHostEnvironment env)
        {
            _env = env;
        }

        [BindProperty(SupportsGet = true)]
        public string Category { get; set; } = "";

        [BindProperty(SupportsGet = true)]
        public string Component { get; set; } = "";

        public string ComponentTitle { get; set; } = "";
        public string BadgeText { get; set; } = "";
        public string PreviewHtml { get; set; } = "";
        public List<CodeSection> CodeSections { get; set; } = [];

        public record CodeSection(string Label, string Lang, string Content);

        public IActionResult OnGet()
        {
            var key = $"{Category}/{Component}".ToLowerInvariant();

            if (!ComponentMeta.ContainsKey(key))
                return RedirectToPage($"/Showcase/{Category}");

            var meta = ComponentMeta[key];
            ComponentTitle = meta.Title;
            PreviewHtml = meta.Preview;

            // HTML section
            CodeSections.Add(new CodeSection("HTML", "html", FormatHtml(meta.Preview)));

            // CSS section
            var css = ExtractSection(
                Path.Combine(_env.WebRootPath, "css", "site.css"),
                meta.CssSectionComment,
                new Regex(@"\n/\*[\s=*\-]", RegexOptions.None, TimeSpan.FromSeconds(1)));
            if (!string.IsNullOrEmpty(css))
                CodeSections.Add(new CodeSection("CSS", "css", css));

            // JS section (if applicable)
            if (meta.JsSectionComment is not null)
            {
                var js = ExtractSection(
                    Path.Combine(_env.WebRootPath, "js", "site.js"),
                    meta.JsSectionComment,
                    new Regex(@"\n// ={10,}", RegexOptions.None, TimeSpan.FromSeconds(1)));
                if (!string.IsNullOrEmpty(js))
                    CodeSections.Add(new CodeSection("JavaScript", "javascript", js));
            }

            // Auto-generate badge from the sections that were actually found
            var labels = CodeSections.Select(s => s.Label).ToList();
            BadgeText = string.Join(" + ", labels);

            return Page();
        }

        private static string ExtractSection(string filePath, string sectionComment, Regex nextSectionPattern)
        {
            if (!System.IO.File.Exists(filePath))
                return "";

            var content = System.IO.File.ReadAllText(filePath);

            var startIndex = content.IndexOf(sectionComment, StringComparison.Ordinal);
            if (startIndex < 0)
                return "";

            var searchFrom = startIndex + sectionComment.Length;
            var nextMatch = nextSectionPattern.Match(content, searchFrom);

            var endIndex = nextMatch.Success ? nextMatch.Index : content.Length;
            return content[startIndex..endIndex].Trim();
        }

        private static string FormatHtml(string html)
        {
            // Simple pretty-print: add newlines after closing tags for readability
            var formatted = html
                .Replace("><", ">\n<")
                .Replace("><", ">\n<");
            return formatted;
        }

        private record Meta(string Title, string Preview, string CssSectionComment, string? JsSectionComment = null);

        private static readonly Dictionary<string, Meta> ComponentMeta = new()
        {
            // ===== BUTTONS =====
            ["buttons/neon-glow"] = new("Neon Glow",
                "<button class=\"btn-neon\">Hover Me</button>",
                "/* Neon Glow Button */"),
            ["buttons/gradient-shift"] = new("Gradient Shift",
                "<button class=\"btn-gradient-shift\">Hover Me</button>",
                "/* Gradient Shift Button */"),
            ["buttons/ripple-effect"] = new("Ripple Effect",
                "<button class=\"btn-ripple\">Click Me</button>",
                "/* Ripple Button */",
                "// ==============================================\n// RIPPLE BUTTON EFFECT"),
            ["buttons/magnetic-pull"] = new("Magnetic Pull",
                "<button class=\"btn-magnetic\">Move Around Me</button>",
                "/* Magnetic Button */",
                "// ==============================================\n// MAGNETIC BUTTON EFFECT"),
            ["buttons/water-fill"] = new("Water Fill",
                "<button class=\"btn-liquid\"><span class=\"btn-liquid-text\">Dive In</span></button>",
                "/* Water Fill Button */"),
            ["buttons/aurora-border"] = new("Aurora Border",
                "<button class=\"btn-aurora\"><span>Hover Me</span></button>",
                "/* Aurora Border Button */"),
            ["buttons/particle-burst"] = new("Particle Burst",
                "<button class=\"btn-particle-burst\"><span>Click Me</span></button>",
                "/* Confetti Burst Button",
                "// ==============================================\n// CONFETTI BURST BUTTON EFFECT"),

            // ===== CARDS =====
            ["cards/glassmorphism"] = new("Glassmorphism",
                "<div class=\"card-glass\"><div class=\"card-glass-icon\"><i class=\"fas fa-gem\"></i></div><h3>Glass Card</h3><p>A frosted glass effect with a rotating conic-gradient border.</p></div>",
                "/* Glass Card */"),
            ["cards/3d-tilt"] = new("3D Tilt",
                "<div class=\"card-tilt\"><div class=\"card-tilt-content\"><div class=\"card-tilt-icon\"><i class=\"fas fa-cube\"></i></div><div>Move your cursor around</div></div></div>",
                "/* 3D Tilt Card */",
                "// ==============================================\n// 3D TILT EFFECT"),
            ["cards/spotlight-tracking"] = new("Spotlight Tracking",
                "<div class=\"card-spotlight\"><h3><i class=\"fas fa-sun\"></i> Spotlight</h3><p>Move your cursor over this card to see a radial light follow your mouse.</p></div>",
                "/* Spotlight Card */",
                "// ==============================================\n// SPOTLIGHT CARD FOLLOW"),
            ["cards/animated-border"] = new("Animated Border",
                "<div class=\"card-animated-border\"><h3><i class=\"fas fa-palette\"></i> Rainbow Border</h3><p>A continuously rotating conic gradient border effect.</p></div>",
                "/* Animated Border Card */"),
            ["cards/deep-sea-caustics"] = new("Deep Sea Caustics",
                "<div class=\"card-deep-sea\"><div class=\"card-deep-sea-caustics\"></div><div class=\"bubble\"></div><div class=\"bubble\"></div><div class=\"bubble\"></div><div class=\"deep-sea-icon\"><i class=\"fas fa-water\"></i></div><h3>Deep Sea</h3><p>Animated underwater caustic light patterns with rising bubbles.</p></div>",
                "/* --- Deep Sea Card --- */"),
            ["cards/liquid-glass"] = new("Liquid Glass",
                "<div class=\"card-liquid-glass\"><h3><i class=\"fas fa-tint\"></i> Liquid Glass</h3><p>Dual animated waves flow across the top edge.</p></div>",
                "/* --- Liquid Glass Card --- */"),
            ["cards/arctic-frost"] = new("Arctic Frost",
                "<div class=\"card-arctic\"><div class=\"card-arctic-aurora\"></div><div class=\"card-arctic-frost-layer\"></div><div class=\"ice-shard\"></div><div class=\"ice-shard\"></div><div class=\"ice-shard\"></div><div class=\"arctic-icon\"><i class=\"fas fa-snowflake\"></i></div><h3>Arctic Frost</h3><p>Crystalline ice shards with aurora borealis.</p></div>",
                "/* --- Arctic Frost Card --- */"),
            ["cards/nebula-storm"] = new("Nebula Storm",
                "<div class=\"card-nebula\"><div class=\"card-nebula-clouds\"></div><div class=\"card-nebula-flare\"></div><div class=\"star-particle\"></div><div class=\"star-particle\"></div><div class=\"star-particle\"></div><div class=\"star-particle\"></div><div class=\"nebula-icon\"><i class=\"fas fa-meteor\"></i></div><h3>Nebula Storm</h3><p>Cosmic gas clouds with a pulsing core flare.</p></div>",
                "/* --- Nebula Storm Card --- */"),
            ["cards/evervault"] = new("Evervault",
                "<div class=\"card-evervault\" data-evervault><div class=\"card-evervault-chars\" aria-hidden=\"true\"></div><div class=\"card-evervault-gradient\"></div><div class=\"card-evervault-chars-overlay\" aria-hidden=\"true\"></div><div class=\"card-evervault-center\"><div class=\"card-evervault-blur\"></div><span class=\"card-evervault-text\">hover</span></div></div>",
                "/* Evervault Card */",
                "// ==============================================\n// EVERVAULT CARD"),
            ["cards/cyberpunk"] = new("Cyberpunk",
                "<div class=\"card-cyber\"><div class=\"card-cyber-scanline\"></div><div class=\"card-cyber-corner card-cyber-tl\"></div><div class=\"card-cyber-corner card-cyber-br\"></div><div class=\"card-cyber-tag\">SYS://ONLINE</div><h3>NEURAL<br>INTERFACE</h3><p>Biometric auth enabled. Latency: 0.02ms.</p><div class=\"card-cyber-bar\"><span class=\"card-cyber-bar-fill\"></span></div><div class=\"card-cyber-status\"><span class=\"card-cyber-dot\"></span> CONNECTED</div></div>",
                "/* ========== CYBERPUNK CARD ========== */"),
            ["cards/holographic"] = new("Holographic",
                "<div class=\"card-holo\"><div class=\"card-holo-shine\"></div><div class=\"card-holo-content\"><div class=\"card-holo-number\">&#9830; 42</div><h3>HOLOGRAPHIC</h3><p>Prismatic refraction with animated light sweep.</p></div></div>",
                "/* ========== HOLOGRAPHIC CARD ========== */"),
            ["cards/terminal"] = new("Terminal",
                "<div class=\"card-terminal\"><div class=\"card-terminal-header\"><span class=\"card-terminal-dot\" style=\"background:#ff5f57\"></span><span class=\"card-terminal-dot\" style=\"background:#febc2e\"></span><span class=\"card-terminal-dot\" style=\"background:#28c840\"></span><span class=\"card-terminal-title\">zsh — 80×24</span></div><div class=\"card-terminal-body\"><div class=\"card-terminal-line\"><span class=\"card-terminal-prompt\">~</span> <span class=\"card-terminal-cmd\">npm run deploy</span></div><div class=\"card-terminal-line card-terminal-success\">✔ Build completed in 1.2s</div><div class=\"card-terminal-line\"><span class=\"card-terminal-prompt\">~</span> <span class=\"card-terminal-cursor\">|</span></div></div></div>",
                "/* ========== TERMINAL CARD ========== */"),
            ["cards/radar-pulse"] = new("Radar Pulse",
                "<div class=\"card-radar\"><div class=\"card-radar-sweep\"></div><div class=\"card-radar-ring card-radar-r1\"></div><div class=\"card-radar-ring card-radar-r2\"></div><div class=\"card-radar-ring card-radar-r3\"></div><div class=\"card-radar-blip card-radar-b1\"></div><div class=\"card-radar-blip card-radar-b2\"></div><div class=\"card-radar-blip card-radar-b3\"></div><div class=\"card-radar-info\"><div class=\"card-radar-label\">SCANNING</div><div class=\"card-radar-val\">3 targets detected</div></div></div>",
                "/* ========== RADAR PULSE CARD ========== */"),

            // ===== LOADERS =====
            ["loaders/orbit-spinner"] = new("Orbit Spinner",
                "<div class=\"loader-orbit\"><div class=\"orbit-ring\"></div><div class=\"orbit-ring\"></div><div class=\"orbit-ring\"></div></div>",
                "/* Orbit Spinner */"),
            ["loaders/morphing-dots"] = new("Morphing Dots",
                "<div class=\"loader-dots\"><div class=\"dot\"></div><div class=\"dot\"></div><div class=\"dot\"></div></div>",
                "/* Morphing Dots */"),
            ["loaders/skeleton-loading"] = new("Skeleton Loading",
                "<div class=\"loader-skeleton\"><div class=\"skeleton-circle\"></div><div class=\"skeleton-line\"></div><div class=\"skeleton-line medium\"></div><div class=\"skeleton-line short\"></div></div>",
                "/* Skeleton Loading */"),
            ["loaders/morph-loader"] = new("Morph Loader",
                "<div class=\"loader-morph-container\"><div class=\"loader-morph\"><div class=\"morph-shape-demo\"></div></div><span class=\"morph-loader-text\">Loading</span></div>",
                "/* Morph Loader */",
                "// ==============================================\n// MORPH LOADER ANIMATED DOTS"),
            ["loaders/helix-spinner"] = new("Helix Spinner",
                "<div class=\"loader-helix\"></div>",
                "/* --- Helix Spinner --- */"),
            ["loaders/neon-line"] = new("Neon Line",
                "<div class=\"loader-neon-line\"></div>",
                "/* --- Neon Line --- */"),
            ["loaders/wave-bars"] = new("Wave Bars",
                "<div class=\"loader-wave\"><div class=\"bar\"></div><div class=\"bar\"></div><div class=\"bar\"></div><div class=\"bar\"></div><div class=\"bar\"></div></div>",
                "/* --- Wave Bars --- */"),
            ["loaders/grid-pulse"] = new("Grid Pulse",
                "<div class=\"loader-grid\"><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div><div class=\"cell\"></div></div>",
                "/* --- Grid Pulse --- */"),
            ["loaders/3d-cube"] = new("3D Cube",
                "<div class=\"loader-cube-scene\"><div class=\"loader-cube\"><div class=\"face\"></div><div class=\"face\"></div><div class=\"face\"></div><div class=\"face\"></div><div class=\"face\"></div><div class=\"face\"></div></div></div>",
                "/* --- 3D Cube --- */"),
            ["loaders/radar-sweep"] = new("Radar Sweep",
                "<div class=\"loader-radar\"><div class=\"radar-ring\"></div><div class=\"radar-ring\"></div></div>",
                "/* --- Radar Sweep --- */"),
            ["loaders/plasma-ring"] = new("Plasma Ring",
                "<div class=\"loader-plasma\"></div>",
                "/* --- Plasma Ring --- */"),
            ["loaders/glitch-bar"] = new("Glitch Bar",
                "<div class=\"loader-glitch-bar\"><div class=\"glitch-track\"></div><div class=\"glitch-ghost\"></div></div>",
                "/* --- Glitch Bar --- */"),
            ["loaders/heartbeat"] = new("Heartbeat",
                "<div class=\"loader-heartbeat-wrap\"><svg class=\"loader-heartbeat\" viewBox=\"0 0 200 60\" width=\"200\" height=\"60\"><polyline class=\"hb-line\" points=\"0,30 50,30 60,30 68,8 76,52 84,22 90,38 96,30 200,30\" /></svg><div class=\"hb-glow\"></div></div>",
                "/* --- Heartbeat --- */"),
            ["loaders/ai-loader"] = new("AI Loader",
                "<div class=\"loader-ai\"><div class=\"loader-ai-circle\"></div><div class=\"loader-ai-letters\"><span class=\"ai-letter\" style=\"animation-delay:0s\">G</span><span class=\"ai-letter\" style=\"animation-delay:0.1s\">e</span><span class=\"ai-letter\" style=\"animation-delay:0.2s\">n</span><span class=\"ai-letter\" style=\"animation-delay:0.3s\">e</span><span class=\"ai-letter\" style=\"animation-delay:0.4s\">r</span><span class=\"ai-letter\" style=\"animation-delay:0.5s\">a</span><span class=\"ai-letter\" style=\"animation-delay:0.6s\">t</span><span class=\"ai-letter\" style=\"animation-delay:0.7s\">i</span><span class=\"ai-letter\" style=\"animation-delay:0.8s\">n</span><span class=\"ai-letter\" style=\"animation-delay:0.9s\">g</span></div></div>",
                "/* --- AI Loader --- */"),
        };
    }
}

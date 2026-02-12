(function () {
// Helper: body base style injected into every preview
var B = 'body{display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#08080d;font-family:"Inter",sans-serif;color:#e4e4e7}';
// Helper: canvas base style
var CB = 'body{margin:0;overflow:hidden;background:#08080d}canvas{display:block;width:100vw;height:100vh}';

// ?? Pretty-print helpers ??
function prettifyCSS(src) {
    var out = '', indent = 0, i = 0, len = src.length;
    while (i < len) {
        var ch = src[i];
        if (ch === '{') {
            out += ' {\n';
            indent++;
            out += pad(indent);
            i++;
        } else if (ch === '}') {
            out = out.replace(/\s+$/, '') + '\n';
            indent = Math.max(0, indent - 1);
            out += pad(indent) + '}\n';
            if (i + 1 < len && src[i + 1] !== '\n') out += '\n' + pad(indent);
            i++;
        } else if (ch === ';') {
            out += ';\n' + pad(indent);
            i++;
        } else if (ch === '\n') {
            if (out[out.length - 1] !== '\n') out += '\n' + pad(indent);
            i++;
        } else {
            out += ch;
            i++;
        }
    }
    return out.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\s+$/gm, '').trim();
    function pad(n) { var s = ''; for (var j = 0; j < n; j++) s += '  '; return s; }
}

function prettifyJS(src) {
    // Tokenise: we need to respect strings so we don't break on ; inside them
    var tokens = [], i = 0, len = src.length;
    while (i < len) {
        var ch = src[i];
        // Strings
        if (ch === '"' || ch === "'") {
            var q = ch, s = ch; i++;
            while (i < len && src[i] !== q) { if (src[i] === '\\') { s += src[i]; i++; } s += src[i]; i++; }
            if (i < len) { s += src[i]; i++; }
            tokens.push({ type: 'str', val: s });
        // Line comments
        } else if (ch === '/' && i + 1 < len && src[i + 1] === '/') {
            var cm = ''; while (i < len && src[i] !== '\n') { cm += src[i]; i++; }
            tokens.push({ type: 'cmt', val: cm });
        } else {
            tokens.push({ type: 'code', val: ch });
            i++;
        }
    }
    // Rebuild with formatting
    var out = '', indent = 0, prev = '';
    for (var t = 0; t < tokens.length; t++) {
        var tk = tokens[t];
        if (tk.type === 'str' || tk.type === 'cmt') {
            out += tk.val;
            prev = tk.val[tk.val.length - 1];
            continue;
        }
        var c = tk.val;
        if (c === '{') {
            out += ' {\n';
            indent++;
            out += pad(indent);
            prev = '\n';
        } else if (c === '}') {
            out = out.replace(/\s+$/, '') + '\n';
            indent = Math.max(0, indent - 1);
            out += pad(indent) + '}';
            // Peek next non-whitespace
            var nx = peekNext(tokens, t);
            if (nx && nx !== '}' && nx !== ';') out += '\n' + pad(indent);
            prev = '}';
        } else if (c === ';') {
            out += ';\n' + pad(indent);
            prev = '\n';
        } else if (c === '\n') {
            if (prev !== '\n') { out += '\n' + pad(indent); prev = '\n'; }
        } else {
            out += c;
            prev = c;
        }
    }
    return out.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/\s+$/gm, '').trim();
    function pad(n) { var s = ''; for (var j = 0; j < n; j++) s += '  '; return s; }
    function peekNext(toks, idx) {
        for (var k = idx + 1; k < toks.length; k++) {
            var v = toks[k].val.trim();
            if (v) return v[0];
        }
        return '';
    }
}

    // ========================================================
    //  ALL EFFECTS BY SECTION
    // ========================================================
    var sections = {

    // ???????????????????? BUTTONS ????????????????????
    'Buttons': {
        'Neon Glow': {
            html: '<button class="btn">Hover Me</button>',
            css: B + '\n.btn{position:relative;padding:1rem 3rem;font-size:1.1rem;font-weight:700;color:#00e5ff;background:transparent;border:2px solid #00e5ff;border-radius:12px;cursor:pointer;overflow:hidden;transition:all .4s;text-transform:uppercase;letter-spacing:.12em;font-family:inherit}\n.btn:hover{color:#000;background:#00e5ff;box-shadow:0 0 20px rgba(0,229,255,.5),0 0 60px rgba(0,229,255,.3),inset 0 0 30px rgba(0,229,255,.15);transform:scale(1.05)}\n.btn::before{content:"";position:absolute;top:50%;left:50%;width:0;height:300%;background:#00e5ff;transform:translate(-50%,-50%) rotate(45deg);transition:width .5s;z-index:-1}\n.btn:hover::before{width:300%}',
            js: ''
        },
        'Liquid Fill': {
            html: '<button class="btn">Hover Me</button>',
            css: B + '\n.btn{position:relative;padding:1rem 3rem;font-size:1.1rem;font-weight:700;color:#8b5cf6;background:transparent;border:2px solid #8b5cf6;border-radius:50px;cursor:pointer;overflow:hidden;transition:color .4s;z-index:1;font-family:inherit}\n.btn::before{content:"";position:absolute;bottom:-100%;left:-10%;width:120%;height:200%;background:#8b5cf6;border-radius:40%;transition:bottom .6s cubic-bezier(.23,1,.32,1);z-index:-1;animation:wobble 3s ease-in-out infinite}\n.btn:hover{color:#fff}\n.btn:hover::before{bottom:-30%}\n@keyframes wobble{0%,100%{border-radius:40%}50%{border-radius:45% 42% 38% 44%}}',
            js: ''
        },
        'Gradient Shift': {
            html: '<button class="btn">Hover Me</button>',
            css: B + '\n.btn{padding:1rem 3rem;font-size:1.1rem;font-weight:700;color:#fff;background:linear-gradient(135deg,#00e5ff,#8b5cf6,#ec4899,#00e5ff);background-size:300% 300%;border:none;border-radius:12px;cursor:pointer;transition:all .4s;animation:gm 4s ease infinite;font-family:inherit}\n.btn:hover{transform:scale(1.08);box-shadow:0 10px 40px rgba(139,92,246,.3)}\n@keyframes gm{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
            js: ''
        },
        'Ripple Effect': {
            html: '<button class="btn">Click Me</button>',
            css: B + '\n.btn{position:relative;padding:1rem 3rem;font-size:1.1rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(255,255,255,.1);border-radius:12px;cursor:pointer;overflow:hidden;transition:all .3s;font-family:inherit}\n.btn:hover{border-color:rgba(255,255,255,.2);transform:translateY(-2px)}\n.rip{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);transform:scale(0);animation:ripple .6s linear;pointer-events:none}\n@keyframes ripple{to{transform:scale(4);opacity:0}}',
            js: 'document.querySelector(".btn").addEventListener("click",function(e){var r=this.getBoundingClientRect();var s=document.createElement("span");s.className="rip";var sz=Math.max(r.width,r.height);s.style.width=s.style.height=sz+"px";s.style.left=(e.clientX-r.left-sz/2)+"px";s.style.top=(e.clientY-r.top-sz/2)+"px";this.appendChild(s);setTimeout(function(){s.remove()},600)});'
        },
        'Magnetic': {
            html: '<button class="btn">Hover Me</button>',
            css: B + '\n.btn{padding:1rem 3rem;font-size:1.1rem;font-weight:600;color:#e4e4e7;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;cursor:pointer;transition:transform .3s cubic-bezier(.23,1,.32,1),background .3s,box-shadow .3s;will-change:transform;font-family:inherit}\n.btn:hover{background:rgba(255,255,255,.1);box-shadow:0 10px 40px rgba(0,0,0,.3)}',
            js: 'var b=document.querySelector(".btn");b.addEventListener("mousemove",function(e){var r=b.getBoundingClientRect();var x=e.clientX-r.left-r.width/2;var y=e.clientY-r.top-r.height/2;b.style.transform="translate("+x*.15+"px,"+y*.15+"px)"});b.addEventListener("mouseleave",function(){b.style.transform="translate(0,0)"});'
        }
    },

    // ???????????????????? CARDS ????????????????????
    'Cards': {
        'Glassmorphism': {
            html: '<div class="card"><h3>Glass Card</h3><p>Frosted glass with rotating conic-gradient border.</p></div>',
            css: B + '\n.card{position:relative;width:300px;padding:2rem;background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);border-radius:20px;overflow:hidden;transition:all .4s}\n.card::before{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:conic-gradient(from 0deg,transparent,rgba(0,229,255,.1) 25%,transparent 50%,rgba(139,92,246,.1) 75%,transparent);animation:rot 8s linear infinite;z-index:-1}\n.card::after{content:"";position:absolute;inset:1px;background:rgba(8,8,13,.9);border-radius:19px;z-index:-1}\n@keyframes rot{to{transform:rotate(360deg)}}\n.card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,229,255,.1)}h3{margin:0 0 .5rem;font-weight:700}p{font-size:.875rem;color:#71717a;margin:0;line-height:1.6}',
            js: ''
        },
        '3D Tilt': {
            html: '<div class="card"><div class="inner">3D Tilt<br>Move your cursor</div></div>',
            css: B + '\n.card{width:300px;height:200px;background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(0,229,255,.05));border:1px solid rgba(255,255,255,.08);border-radius:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;will-change:transform;transition:box-shadow .4s}\n.card:hover{box-shadow:0 25px 60px rgba(0,0,0,.4)}\n.inner{text-align:center;font-weight:600;font-size:1rem;transform:translateZ(30px)}',
            js: 'var c=document.querySelector(".card");c.addEventListener("mousemove",function(e){var r=c.getBoundingClientRect();var rx=((e.clientY-r.top-r.height/2)/r.height*2)*-12;var ry=((e.clientX-r.left-r.width/2)/r.width*2)*12;c.style.transform="perspective(1000px) rotateX("+rx+"deg) rotateY("+ry+"deg)"});c.addEventListener("mouseleave",function(){c.style.transform="perspective(1000px) rotateX(0) rotateY(0)"});'
        },
        'Spotlight Tracking': {
            html: '<div class="card"><h3>Spotlight</h3><p>Move cursor over to see a radial light follow your mouse.</p></div>',
            css: B + '\n.card{position:relative;width:300px;padding:2rem;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden;cursor:pointer;transition:all .4s}\n.card::before{content:"";position:absolute;width:250px;height:250px;background:radial-gradient(circle,rgba(0,229,255,.15),transparent 70%);border-radius:50%;pointer-events:none;opacity:0;transition:opacity .4s;transform:translate(-50%,-50%);left:var(--sx,50%);top:var(--sy,50%)}\n.card:hover::before{opacity:1}\n.card:hover{border-color:rgba(255,255,255,.15)}h3{margin:0 0 .5rem;font-weight:700;position:relative}p{font-size:.875rem;color:#71717a;margin:0;position:relative}',
            js: 'var c=document.querySelector(".card");c.addEventListener("mousemove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--sx",(e.clientX-r.left)+"px");c.style.setProperty("--sy",(e.clientY-r.top)+"px")});'
        },
        'Animated Border': {
            html: '<div class="card"><h3>Animated Border</h3><p>A conic-gradient border that continuously rotates around the card.</p></div>',
            css: B + '\n@property --ba{syntax:"<angle>";initial-value:0deg;inherits:false}\n.card{position:relative;width:300px;padding:2rem;border-radius:20px;background:#0e0e16;z-index:1}\n.card::before{content:"";position:absolute;inset:-2px;border-radius:22px;background:conic-gradient(from var(--ba),#00e5ff,#8b5cf6,#ec4899,#00e5ff);z-index:-2;animation:rb 4s linear infinite}\n.card::after{content:"";position:absolute;inset:0;border-radius:20px;background:#0e0e16;z-index:-1}\n@keyframes rb{to{--ba:360deg}}h3{margin:0 0 .5rem;font-weight:700}p{font-size:.875rem;color:#71717a;margin:0;line-height:1.6}',
            js: ''
        }
    },

    // ???????????????????? TEXT EFFECTS ????????????????????
    'Text Effects': {
        'Animated Gradient': {
            html: '<span class="txt">Flowing Colors</span>',
            css: B + '\n.txt{font-size:3.5rem;font-weight:900;background:linear-gradient(90deg,#00e5ff,#8b5cf6,#ec4899,#00e5ff);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:tg 3s linear infinite}\n@keyframes tg{to{background-position:200% center}}',
            js: ''
        },
        'Glitch Distortion': {
            html: '<span class="g" data-text="GLITCH">GLITCH</span>',
            css: B + '\n.g{position:relative;font-size:3.5rem;font-weight:900;letter-spacing:.05em;color:#fff;text-transform:uppercase}\n.g::before,.g::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%}\n.g::before{color:#00e5ff;animation:g1 2s infinite linear alternate-reverse;clip-path:polygon(0 0,100% 0,100% 35%,0 35%);z-index:-1}\n.g::after{color:#ec4899;animation:g2 2s infinite linear alternate-reverse;clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%);z-index:-1}\n@keyframes g1{0%,90%,100%{transform:translate(0)}92%{transform:translate(-4px,2px)}94%{transform:translate(3px,-1px)}96%{transform:translate(-2px,-3px)}98%{transform:translate(4px,1px)}}\n@keyframes g2{0%,90%,100%{transform:translate(0)}91%{transform:translate(3px,-2px)}93%{transform:translate(-4px,1px)}95%{transform:translate(2px,3px)}97%{transform:translate(-3px,-1px)}}',
            js: ''
        },
        'Typewriter': {
            html: '<span class="tw">console.log("Hello!");</span>',
            css: B + '\n.tw{font-family:"JetBrains Mono",monospace;font-size:1.8rem;font-weight:600;color:#10b981;overflow:hidden;white-space:nowrap;border-right:2px solid #10b981;width:0;animation:type 3s steps(22) .5s forwards,blink .8s step-end infinite}\n@keyframes type{to{width:100%}}\n@keyframes blink{50%{border-color:transparent}}',
            js: ''
        },
        'Neon Sign': {
            html: '<span class="n">NEON</span>',
            css: B + '\nbackground:#000}\n.n{font-size:3.5rem;font-weight:900;color:#fff;text-shadow:0 0 7px rgba(0,229,255,.7),0 0 10px rgba(0,229,255,.5),0 0 21px rgba(0,229,255,.4),0 0 42px rgba(0,229,255,.3),0 0 82px rgba(0,229,255,.2);animation:nf 3s infinite}\n@keyframes nf{0%,19%,21%,23%,25%,54%,56%,100%{text-shadow:0 0 7px rgba(0,229,255,.7),0 0 10px rgba(0,229,255,.5),0 0 21px rgba(0,229,255,.4),0 0 42px rgba(0,229,255,.3),0 0 82px rgba(0,229,255,.2)}20%,24%,55%{text-shadow:none}}',
            js: ''
        }
    },

    // ???????????????????? LOADERS ????????????????????
    'Loaders': {
        'Orbit Spinner': {
            html: '<div class="lo"><div class="r"></div><div class="r"></div><div class="r"></div></div>',
            css: B + '\n.lo{position:relative;width:60px;height:60px}\n.r{position:absolute;inset:0;border:2px solid transparent;border-radius:50%}\n.r:nth-child(1){border-top-color:#00e5ff;animation:o 1.2s linear infinite}\n.r:nth-child(2){inset:6px;border-right-color:#8b5cf6;animation:o 1.6s linear infinite reverse}\n.r:nth-child(3){inset:12px;border-bottom-color:#ec4899;animation:o 2s linear infinite}\n@keyframes o{to{transform:rotate(360deg)}}',
            js: ''
        },
        'Pulse Ring': {
            html: '<div class="lp"><div class="rg"></div><div class="rg"></div><div class="rg"></div><div class="core"></div></div>',
            css: B + '\n.lp{position:relative;width:60px;height:60px;display:flex;align-items:center;justify-content:center}\n.rg{position:absolute;width:100%;height:100%;border:2px solid #00e5ff;border-radius:50%;animation:pr 2s ease-out infinite}\n.rg:nth-child(2){animation-delay:.4s}\n.rg:nth-child(3){animation-delay:.8s}\n.core{width:12px;height:12px;background:#00e5ff;border-radius:50%;box-shadow:0 0 20px rgba(0,229,255,.5)}\n@keyframes pr{0%{transform:scale(.3);opacity:1}100%{transform:scale(1.2);opacity:0}}',
            js: ''
        },
        'Morphing Dots': {
            html: '<div class="ld"><div class="d"></div><div class="d"></div><div class="d"></div></div>',
            css: B + '\n.ld{display:flex;gap:8px;align-items:center}\n.d{width:14px;height:14px;border-radius:50%;animation:md 1.4s ease-in-out infinite}\n.d:nth-child(1){background:#00e5ff;animation-delay:0s}\n.d:nth-child(2){background:#8b5cf6;animation-delay:.2s}\n.d:nth-child(3){background:#ec4899;animation-delay:.4s}\n@keyframes md{0%,100%{transform:scale(1) translateY(0);border-radius:50%}25%{transform:scale(1.3) translateY(-10px);border-radius:30%}50%{transform:scale(1) translateY(0);border-radius:50%}}',
            js: ''
        },
        'Morph Loader': {
            html: '<div class="mc"><div class="ml"><div class="ms"></div></div><span class="mt">Loading</span></div>',
            css: B + '\n.mc{display:flex;flex-direction:column;align-items:center;gap:2rem}\n.ml{width:80px;height:80px}\n.ms{width:100%;height:100%;background:linear-gradient(135deg,#00e5ff,#8b5cf6,#ec4899);background-size:400% 400%;animation:mo 3s ease-in-out infinite,mg 4s ease infinite,ms 6s linear infinite;box-shadow:0 0 40px rgba(0,229,255,.3),0 0 80px rgba(139,92,246,.15)}\n@keyframes mo{0%,100%{border-radius:50%}25%{border-radius:30% 70% 70% 30%/30% 30% 70% 70%}50%{border-radius:50% 20% 50% 20%/20% 50% 20% 50%}75%{border-radius:70% 30% 30% 70%/70% 70% 30% 30%}}\n@keyframes mg{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}\n@keyframes ms{to{transform:rotate(360deg)}}\n.mt{color:#71717a;font-size:.85rem;font-weight:600;letter-spacing:.3em;text-transform:uppercase;animation:mp 2s ease-in-out infinite}\n@keyframes mp{0%,100%{opacity:.4}50%{opacity:1}}',
            js: 'var t=document.querySelector(".mt");var d=0;setInterval(function(){d=(d+1)%4;t.textContent="Loading"+".".repeat(d)},400);'
        },
        'Skeleton': {
            html: '<div class="sk"><div class="sc"></div><div class="sl"></div><div class="sl med"></div><div class="sl sh"></div></div>',
            css: B + '\n.sk{width:280px;padding:1.5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px}\n.sl{height:12px;background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;border-radius:6px;animation:sh 1.5s ease-in-out infinite;margin-bottom:.75rem}\n.sl:last-child{margin-bottom:0}\n.sl.sh{width:60%}\n.sl.med{width:80%}\n.sc{width:48px;height:48px;border-radius:50%;background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:sh 1.5s ease-in-out infinite;margin-bottom:1rem}\n@keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}',
            js: ''
        }
    },

    // ???????????????????? 3D CANVAS ????????????????????
    '3D Canvas': {
        'Particle Nebula': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),tm=0,md=0,NP=4000,ps=[],tw="",fc=false;',
                'c.width=innerWidth;c.height=innerHeight;',
                'var tc=document.createElement("canvas"),tx=tc.getContext("2d");',
                'for(var i=0;i<NP;i++){var a=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=80+Math.random()*180;ps.push({x:r*Math.sin(ph)*Math.cos(a),y:r*Math.sin(ph)*Math.sin(a),z:r*Math.cos(ph),tx:0,ty:0,tz:0,vx:0,vy:0,vz:0,sz:.6+Math.random()*1.4,hu:195+Math.random()*40,al:.7+Math.random()*.3,sp:.001+Math.random()*.003,pp:Math.random()*Math.PI*2})}',
                'function smp(t){tc.width=c.width;tc.height=c.height;var fs=Math.min(200,c.height*.55);tx.font="bold "+fs+"px Arial";tx.textAlign="center";tx.textBaseline="middle";while(tx.measureText(t).width>c.width*.85&&fs>8){fs-=2;tx.font="bold "+fs+"px Arial"}tx.fillStyle="white";tx.fillText(t,c.width/2,c.height/2);var d=tx.getImageData(0,0,c.width,c.height).data,pts=[];for(var y=0;y<c.height;y+=3)for(var px=0;px<c.width;px+=3)if(d[(y*c.width+px)*4+3]>128)pts.push({x:px-c.width/2,y:y-c.height/2});return pts}',
                'function st(m,t){if(m===3&&t){var pts=smp(t);if(!pts.length){st(0);return}ps.forEach(function(p,i){var pt=pts[i%pts.length];p.tx=pt.x+(Math.random()-.5)*3;p.ty=pt.y+(Math.random()-.5)*3;p.tz=(Math.random()-.5)*30})}else{ps.forEach(function(p,i){var a2=Math.random()*Math.PI*2,ph2=Math.acos(2*Math.random()-1);if(m===0){var r2=80+Math.random()*180;p.tx=r2*Math.sin(ph2)*Math.cos(a2);p.ty=r2*Math.sin(ph2)*Math.sin(a2);p.tz=r2*Math.cos(ph2)}else if(m===1){var rn=i%2===0?120:200,ag=(i/NP)*Math.PI*16;p.tx=Math.cos(ag)*rn;p.ty=(Math.random()-.5)*40;p.tz=Math.sin(ag)*rn}else{var t2=(i/NP)*Math.PI*12,sd=i%2===0?1:-1;p.tx=Math.cos(t2)*100*sd;p.ty=(i/NP-.5)*400;p.tz=Math.sin(t2)*100*sd}})}}st(0);',
                'function bu(){ps.forEach(function(p){p.vx+=(Math.random()-.5)*5;p.vy+=(Math.random()-.5)*5;p.vz+=(Math.random()-.5)*5})}',
                'c.setAttribute("tabindex","0");c.addEventListener("click",function(){fc=true;tw="";c.focus();md=(md+1)%3;st(md);bu()});',
                'c.addEventListener("keydown",function(e){if(!fc)return;if(e.key==="Backspace")tw=tw.slice(0,-1);else if(e.key==="Escape"){tw="";md=0;st(0);bu();return}else if(e.key.length===1)tw+=e.key;else return;e.preventDefault();if(tw){md=3;st(3,tw.toUpperCase())}else{md=0;st(0)}bu()});',
                'function go(){x.fillStyle="rgba(3,8,16,0.12)";x.fillRect(0,0,c.width,c.height);tm+=.005;var cx2=c.width/2,cy2=c.height/2,flat=md===3,rot=flat?0:tm*.3,ca=Math.cos(rot),sa=Math.sin(rot);',
                'var gl=x.createRadialGradient(cx2,cy2,0,cx2,cy2,200);gl.addColorStop(0,"rgba(0,160,255,0.12)");gl.addColorStop(0.4,"rgba(0,100,255,0.04)");gl.addColorStop(1,"transparent");x.fillStyle=gl;x.fillRect(0,0,c.width,c.height);',
                'ps.forEach(function(p){p.vx+=(p.tx-p.x)*.008;p.vy+=(p.ty-p.y)*.008;p.vz+=(p.tz-p.z)*.008;p.vx*=.96;p.vy*=.96;p.vz*=.96;p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;var px2,py2,sc;',
                'if(flat){px2=p.x+cx2;py2=p.y+cy2;sc=1}else{var cs=Math.cos(p.sp),sn=Math.sin(p.sp),nx=p.x*cs-p.z*sn;p.z=p.x*sn+p.z*cs;p.x=nx;var rx=p.x*ca-p.z*sa,rz=p.x*sa+p.z*ca;sc=500/(500+rz+250);px2=rx*sc+cx2;py2=p.y*sc+cy2}',
                'if(sc>0){var pl=.7+Math.sin(tm*3+p.pp)*.3,aa=Math.min(1,p.al*sc*pl),rr=p.sz*sc;x.fillStyle="hsla("+p.hu+",90%,65%,"+aa+")";x.beginPath();x.arc(px2,py2,rr,0,Math.PI*2);x.fill();if(rr>.8){x.fillStyle="hsla("+p.hu+",60%,90%,"+(aa*.5)+")";x.beginPath();x.arc(px2,py2,rr*.35,0,Math.PI*2);x.fill()}}});',
                'requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Wave Terrain': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d");',
                'c.width=innerWidth;c.height=innerHeight;',
                'var cols=50,rows=30,sp=18,t=0,mm={x:.5,y:.5,on:false};',
                'c.addEventListener("mousemove",function(e){var r=c.getBoundingClientRect();mm.x=(e.clientX-r.left)/r.width;mm.y=(e.clientY-r.top)/r.height;mm.on=true});',
                'c.addEventListener("mouseleave",function(){mm.on=false});',
                'function iso(col,row,z){var gx=col-cols/2,gy=row-rows/2;return{x:c.width/2+(gx-gy)*sp*.7,y:c.height/2+(gx+gy)*sp*.35-z}}',
                'function gz(gx,gy){var d=Math.sqrt(gx*gx+gy*gy),mz=0;if(mm.on){var mx=(mm.x-.5)*cols,my=(mm.y-.5)*rows,md=Math.sqrt((gx-mx)*(gx-mx)+(gy-my)*(gy-my));mz=Math.sin(md*.8-t*3)*20/(1+md*.15)}return Math.sin(d*.4-t*2)*25+Math.sin(gx*.3+t)*12+Math.cos(gy*.4+t*1.3)*8+mz}',
                'function go(){x.clearRect(0,0,c.width,c.height);t+=.025;',
                'for(var r=0;r<rows;r++)for(var cl=0;cl<cols;cl++){',
                'var gx=cl-cols/2,gy=r-rows/2,d=Math.sqrt(gx*gx+gy*gy),z=gz(gx,gy),p=iso(cl,r,z),h=190+z*1.5,a=Math.max(.1,1-d/(cols*.6));',
                'x.fillStyle="hsla("+h+",75%,55%,"+a+")";x.beginPath();x.arc(p.x,p.y,2,0,Math.PI*2);x.fill();',
                'if(cl>0){var pz=gz(cl-1-cols/2,gy),pp=iso(cl-1,r,pz);x.strokeStyle="hsla("+h+",60%,45%,"+(a*.4)+")";x.lineWidth=.5;x.beginPath();x.moveTo(pp.x,pp.y);x.lineTo(p.x,p.y);x.stroke()}',
                'if(r>0){var pz2=gz(gx,r-1-rows/2),pp2=iso(cl,r-1,pz2);x.strokeStyle="hsla("+h+",60%,45%,"+(a*.4)+")";x.lineWidth=.5;x.beginPath();x.moveTo(pp2.x,pp2.y);x.lineTo(p.x,p.y);x.stroke()}}',
                'requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Geometric Vortex': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),sh=[],SC=80,t=0;',
                'c.width=innerWidth;c.height=innerHeight;',
                'function S(i){this.a=(i/SC)*Math.PI*2;this.r=40+Math.random()*200;this.z=Math.random()*600-300;this.sp=.008+Math.random()*.012;this.zs=1.5+Math.random()*2;this.sides=Math.floor(Math.random()*4)+3;this.sz=6+Math.random()*14;this.h=Math.random()*80+250;this.rs=(Math.random()-.5)*.04;this.rot=0}',
                'for(var i=0;i<SC;i++)sh.push(new S(i));',
                'function dp(px,py,r,sides,rot,h,al){x.beginPath();for(var i=0;i<=sides;i++){var a=rot+(i/sides)*Math.PI*2;var cx=px+Math.cos(a)*r,cy=py+Math.sin(a)*r;i===0?x.moveTo(cx,cy):x.lineTo(cx,cy)}x.closePath();x.strokeStyle="hsla("+h+",80%,65%,"+al+")";x.lineWidth=1.5;x.stroke()}',
                'function go(){x.fillStyle="rgba(8,8,13,0.12)";x.fillRect(0,0,c.width,c.height);t+=.01;',
                'var cx=c.width/2,cy=c.height/2;sh.sort(function(a,b){return b.z-a.z});',
                'sh.forEach(function(s){s.a+=s.sp;s.z-=s.zs;s.rot+=s.rs;if(s.z<-300)s.z=300;',
                'var sc=500/(500+s.z),px=cx+Math.cos(s.a)*s.r*sc,py=cy+Math.sin(s.a)*s.r*sc,sz=s.sz*sc,al=Math.max(.1,sc),h=(s.h+t*20)%360;',
                'x.shadowBlur=15*sc;x.shadowColor="hsla("+h+",80%,65%,0.3)";dp(px,py,sz,s.sides,s.rot,h,al);x.shadowBlur=0});',
                'requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Particle Burst': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),ps=[],m={x:-9999,y:-9999,vx:0,vy:0,r:150},RR=0.12;',
                'c.width=innerWidth;c.height=innerHeight;',
                'function P(px,py){this.x=px;this.y=py;this.bx=px;this.by=py;this.sz=.4+Math.random()*1;this.h=Math.random()*60+170;this.vx=0;this.vy=0}',
                'var bs=Math.min(c.width,c.height)*.005,mg=bs*30,bL=c.width/2-bs*55-mg,bR=c.width/2+bs*55+mg,bT=c.height/2-bs*80-mg,bB=c.height/2+bs*107+mg;P.prototype.update=function(){var dx=m.x-this.x,dy=m.y-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<m.r&&d>.1){var ms=Math.sqrt(m.vx*m.vx+m.vy*m.vy);if(ms>.5){var pr=(m.r-d)/m.r;this.vx+=m.vx*pr*.3;this.vy+=m.vy*pr*.3;var st=pr*pr*Math.min(ms*.4,12);this.vx+=(Math.random()-.5)*st*.15;this.vy+=(Math.random()-.5)*st*.15}}this.vx*=.88;this.vy*=.88;this.x+=this.vx;this.y+=this.vy;this.x+=(this.bx-this.x)*RR;this.y+=(this.by-this.y)*RR;if(this.x<bL){this.x=bL;this.vx*=-.3}if(this.x>bR){this.x=bR;this.vx*=-.3}if(this.y<bT){this.y=bT;this.vy*=-.3}if(this.y>bB){this.y=bB;this.vy*=-.3}};',
                'P.prototype.draw=function(){var sp=Math.sqrt(this.vx*this.vx+this.vy*this.vy),al=Math.min(1,.55+sp*.1);x.fillStyle="hsla("+(this.h+sp*12)+",90%,65%,"+al+")";x.beginPath();x.arc(this.x,this.y,this.sz,0,Math.PI*2);x.fill();if(this.sz>.6){x.fillStyle="hsla("+(this.h+sp*12)+",60%,90%,"+(al*.4)+")";x.beginPath();x.arc(this.x,this.y,this.sz*.3,0,Math.PI*2);x.fill()}};',
                'x.fillStyle="white";var cx=c.width/2,cy=c.height/2;function ci(bx,by,r){x.beginPath();x.arc(cx+bx*bs,cy+by*bs,r*bs,0,Math.PI*2);x.fill()}',
                'ci(0,40,55);ci(0,-30,42);ci(-32,-62,18);ci(32,-62,18);ci(-50,25,20);ci(50,25,20);ci(-25,85,22);ci(25,85,22);',
                'var d=x.getImageData(0,0,c.width,c.height).data;x.clearRect(0,0,c.width,c.height);',
                'for(var y=0;y<c.height;y+=3)for(var px=0;px<c.width;px+=3)if(d[(y*c.width+px)*4+3]>128)ps.push(new P(px,y));',
                'c.addEventListener("mousemove",function(e){var nx=e.clientX,ny=e.clientY;if(m.x<-999){m.x=nx;m.y=ny;m.vx=0;m.vy=0}else{m.vx=nx-m.x;m.vy=ny-m.y;m.x=nx;m.y=ny}});c.addEventListener("mouseleave",function(){m.x=-9999;m.y=-9999;m.vx=0;m.vy=0});',
                'function go(){x.fillStyle="rgba(8,8,13,0.1)";x.fillRect(0,0,c.width,c.height);m.vx*=.8;m.vy*=.8;for(var i=0;i<ps.length;i++){ps[i].update();ps[i].draw()}requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Wave Canvas': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),t=0;',
                'c.width=innerWidth;c.height=innerHeight;',
                'var cols=["rgba(0,229,255,0.4)","rgba(139,92,246,0.35)","rgba(236,72,153,0.3)","rgba(16,185,129,0.25)","rgba(245,158,11,0.2)"];',
                'function dw(yB,a,f,s,col){x.beginPath();x.moveTo(0,c.height);for(var i=0;i<=c.width;i+=2){var y=yB+Math.sin(i*f+t*s)*a+Math.sin(i*f*.5+t*s*1.3)*a*.5+Math.cos(i*f*.3+t*s*.7)*a*.3;x.lineTo(i,y)}x.lineTo(c.width,c.height);x.closePath();x.fillStyle=col;x.fill();',
                'x.beginPath();for(var i2=0;i2<=c.width;i2+=2){var y2=yB+Math.sin(i2*f+t*s)*a+Math.sin(i2*f*.5+t*s*1.3)*a*.5+Math.cos(i2*f*.3+t*s*.7)*a*.3;i2===0?x.moveTo(i2,y2):x.lineTo(i2,y2)}var p=col.split(",");p[p.length-1]="0.8)";x.strokeStyle=p.join(",");x.lineWidth=1.5;x.stroke()}',
                'function go(){x.fillStyle="rgba(8,8,13,0.3)";x.fillRect(0,0,c.width,c.height);t+=.015;for(var i=4;i>=0;i--)dw(c.height*.5+i*40,30+i*8,.006-i*.0005,1.5+i*.3,cols[i]);requestAnimationFrame(go)}go();',
                'addEventListener("resize",function(){c.width=innerWidth;c.height=innerHeight});'
            ].join('\n')
        },
        'Starfield Warp': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),st=[];',
                'c.width=innerWidth;c.height=innerHeight;',
                'for(var i=0;i<1000;i++)st.push({x:(Math.random()-.5)*c.width*2,y:(Math.random()-.5)*c.height*2,z:Math.random()*1500,pz:0});',
                'function go(){x.fillStyle="rgba(8,8,13,0.2)";x.fillRect(0,0,c.width,c.height);var cx=c.width/2,cy=c.height/2;',
                'st.forEach(function(s){s.pz=s.z;s.z-=8;if(s.z<=0){s.x=(Math.random()-.5)*c.width*2;s.y=(Math.random()-.5)*c.height*2;s.z=1500;s.pz=1500}',
                'var sx=cx+s.x/s.z*400,sy=cy+s.y/s.z*400,px=cx+s.x/s.pz*400,py=cy+s.y/s.pz*400,b=1-s.z/1500;',
                'x.strokeStyle="hsla("+(200+b*40)+",70%,"+(50+b*50)+"%,"+b+")";x.lineWidth=b*2.5;x.beginPath();x.moveTo(px,py);x.lineTo(sx,sy);x.stroke()});',
                'requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Matrix Rain': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d");',
                'c.width=innerWidth;c.height=innerHeight;',
                'var fs=14,cl=Math.floor(c.width/fs),dr=[];for(var i=0;i<cl;i++)dr[i]=1;',
                'var ch="????????????????????0123456789ABCDEF";',
                'function go(){x.fillStyle="rgba(8,8,13,0.05)";x.fillRect(0,0,c.width,c.height);x.font=fs+"px monospace";',
                'for(var i=0;i<cl;i++){var s=ch[Math.floor(Math.random()*ch.length)],y=dr[i]*fs;x.fillStyle="#afffaf";x.fillText(s,i*fs,y);x.fillStyle="rgba(0,255,70,0.15)";x.fillText(s,i*fs,y-fs);',
                'if(y>c.height&&Math.random()>.975)dr[i]=0;dr[i]++}requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Segmented Dome': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),bl=[],rY=0;',
                'c.width=innerWidth;c.height=innerHeight;',
                'var R=Math.min(c.width,c.height)*.35;',
                'for(var rg=0;rg<8;rg++){var phi=((rg+.5)/8.5)*Math.PI*.52,rYY=R*Math.cos(phi),rR=R*Math.sin(phi),cnt=Math.max(6,Math.round(rR*2*Math.PI/35));',
                'for(var i=0;i<cnt;i++){var th=(i/cnt)*Math.PI*2+rg*.2;bl.push({hx:rR*Math.cos(th),hy:-rYY,hz:rR*Math.sin(th),ox:0,oy:0,oz:0,vx:0,vy:0,vz:0,bw:(Math.PI*2*rR/cnt)*.8,bh:(R/8)*.75,hu:195+Math.random()*25,lt:55+Math.random()*20})}}',
                'c.addEventListener("click",function(){bl.forEach(function(b){var d=Math.sqrt(b.hx*b.hx+b.hy*b.hy+b.hz*b.hz)||1,f=4+Math.random()*6;b.vx+=(b.hx/d)*f*(.5+Math.random());b.vy+=(b.hy/d)*f*(.5+Math.random())-2;b.vz+=(b.hz/d)*f*(.5+Math.random())})});',
                'function go(){x.fillStyle="rgba(8,8,13,0.15)";x.fillRect(0,0,c.width,c.height);rY+=.005;',
                'var cx=c.width/2,cy=c.height/2+R*.15,cR=Math.cos(rY),sR=Math.sin(rY),pr=[];',
                'bl.forEach(function(b){b.vx-=b.ox*.02;b.vy-=b.oy*.02;b.vz-=b.oz*.02;b.vx*=.97;b.vy*=.97;b.vz*=.97;b.ox+=b.vx;b.oy+=b.vy;b.oz+=b.vz;',
                'var rx=(b.hx+b.ox)*cR-(b.hz+b.oz)*sR,rz=(b.hx+b.ox)*sR+(b.hz+b.oz)*cR,sc=600/(600+rz+R);',
                'pr.push({x:cx+rx*sc,y:cy+(b.hy+b.oy)*sc,s:sc,z:rz,w:b.bw,h:b.bh,hu:b.hu,lt:b.lt})});',
                'pr.sort(function(a,b){return a.z-b.z});',
                'pr.forEach(function(p){var w=p.w*p.s,h=p.h*p.s,br=p.lt*p.s;x.fillStyle="hsla("+p.hu+",15%,"+Math.min(90,br)+"%,"+(0.3+p.s*.6)+")";x.strokeStyle="hsla("+p.hu+",30%,"+Math.min(95,br+15)+"%,"+(0.1+p.s*.3)+")";x.lineWidth=Math.max(.5,p.s);x.fillRect(p.x-w/2,p.y-h/2,w,h);x.strokeRect(p.x-w/2,p.y-h/2,w,h)});',
                'requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'Aurora Borealis': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),t=0,st=[];',
                'c.width=innerWidth;c.height=innerHeight;',
                'for(var i=0;i<200;i++)st.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.5+.3,tw:Math.random()*Math.PI*2,sp:.5+Math.random()*2});',
                'function sky(){var g=x.createLinearGradient(0,0,0,c.height);g.addColorStop(0,"#010308");g.addColorStop(.5,"#040a18");g.addColorStop(.85,"#0a1520");g.addColorStop(1,"#101820");x.fillStyle=g;x.fillRect(0,0,c.width,c.height);',
                'st.forEach(function(s){var f=.3+Math.sin(t*s.sp+s.tw)*.4;x.fillStyle="rgba(255,255,255,"+f+")";x.beginPath();x.arc(s.x,s.y,s.r,0,Math.PI*2);x.fill()})}',
                'function aurora(){x.globalCompositeOperation="screen";for(var i=0;i<c.width;i+=3){var w=Math.sin(i*.008+t*.5)+Math.sin(i*.003+t*.8)*.6+Math.sin(i*.015+t*.3)*.3;',
                'var inten=.5+w*.3,ct=c.height*.02+w*20,cl=c.height*(.3+inten*.2),hu=130+Math.sin(i*.005+t*.2)*25;',
                'var g=x.createLinearGradient(i,ct,i,ct+cl);g.addColorStop(0,"hsla("+hu+",85%,65%,"+(inten*.5)+")");g.addColorStop(.15,"hsla("+(hu+10)+",80%,55%,"+(inten*.35)+")");g.addColorStop(.5,"hsla("+(hu+20)+",70%,45%,"+(inten*.12)+")");g.addColorStop(1,"transparent");x.fillStyle=g;x.fillRect(i,ct,3,cl)}x.globalCompositeOperation="source-over"}',
                'function go(){t+=.005;sky();aurora();requestAnimationFrame(go)}go();'
            ].join('\n')
        },
        'DNA Helix': {
            html: '<canvas id="c"></canvas>',
            css: CB,
            js: [
                'var c=document.getElementById("c"),x=c.getContext("2d"),t=0;',
                'c.width=innerWidth;c.height=innerHeight;',
                'var cx=c.width/2,cy=c.height/2,HR=100,HL=c.height*.7,N=60;',
                'var rc=[[0,229,255],[139,92,246],[236,72,153],[16,185,129]];',
                'function go(){x.fillStyle="rgba(8,8,13,0.1)";x.fillRect(0,0,c.width,c.height);t+=.02;',
                'var p1=[],p2=[];for(var i=0;i<N;i++){var a=(i/N)*Math.PI*4+t,y=cy-HL/2+(i/N)*HL,z1=Math.sin(a)*HR,z2=Math.sin(a+Math.PI)*HR,s1=400/(400+z1+200),s2=400/(400+z2+200);',
                'p1.push({x:cx+Math.cos(a)*HR*s1,y:cy+(y-cy)*s1,s:s1});p2.push({x:cx+Math.cos(a+Math.PI)*HR*s2,y:cy+(y-cy)*s2,s:s2})}',
                'for(var i=0;i<N;i+=3){var a2=p1[i],b=p2[i],cl=rc[i%4],al=.12+Math.min(a2.s,b.s)*.3;x.strokeStyle="rgba("+cl[0]+","+cl[1]+","+cl[2]+","+al+")";x.lineWidth=2;x.beginPath();x.moveTo(a2.x,a2.y);x.lineTo(b.x,b.y);x.stroke()}',
                '[[p1,180],[p2,320]].forEach(function(d){var pts=d[0],h=d[1];x.beginPath();pts.forEach(function(p,i){i===0?x.moveTo(p.x,p.y):x.lineTo(p.x,p.y)});x.strokeStyle="hsla("+h+",80%,65%,0.7)";x.lineWidth=3;x.stroke();',
                'pts.forEach(function(p){x.fillStyle="hsla("+h+",80%,70%,"+(.5+p.s*.4)+")";x.beginPath();x.arc(p.x,p.y,3*p.s,0,Math.PI*2);x.fill()})});',
                'requestAnimationFrame(go)}go();'
            ].join('\n')
        }
    }
    };

    // ========================================================
    //  EDITOR LOGIC
    // ========================================================
    var sectionSelect = document.getElementById('section-select');
    var effectSelect = document.getElementById('effect-select');
    var htmlEditor = document.getElementById('editor-html');
    var cssEditor = document.getElementById('editor-css');
    var jsEditor = document.getElementById('editor-js');
    var highlightHtml = document.getElementById('highlight-html');
    var highlightCss = document.getElementById('highlight-css');
    var highlightJs = document.getElementById('highlight-js');
    var previewFrame = document.getElementById('preview-frame');
    var tabs = document.querySelectorAll('.editor-tab');
    var panes = document.querySelectorAll('.playground-page .editor-pane');
    var editors = document.querySelectorAll('.playground-page .code-editor');
    var runBtn = document.getElementById('btn-run');
    var copyBtn = document.getElementById('btn-copy');
    var resetBtn = document.getElementById('btn-reset');

    if (!sectionSelect || !effectSelect || !htmlEditor) return;

    var activeTab = 'html'; // tracks which tab is showing

    // Populate section dropdown
    var sectionNames = Object.keys(sections);
    sectionNames.forEach(function (name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        sectionSelect.appendChild(opt);
    });

    // On section change ? populate effect dropdown
    function populateEffects() {
        var sec = sections[sectionSelect.value];
        effectSelect.innerHTML = '';
        if (!sec) return;
        Object.keys(sec).forEach(function (name) {
            var opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            effectSelect.appendChild(opt);
        });
        loadEffect();
    }

    sectionSelect.addEventListener('change', populateEffects);

    // On effect change ? load into editors
    effectSelect.addEventListener('change', loadEffect);

    function loadEffect() {
        var sec = sections[sectionSelect.value];
        if (!sec) return;
        var eff = sec[effectSelect.value];
        if (!eff) return;
        htmlEditor.value = eff.html;
        cssEditor.value = prettifyCSS(eff.css);
        jsEditor.value = eff.js ? prettifyJS(eff.js) : '';
        syncHighlight(htmlEditor, highlightHtml, 'markup');
        syncHighlight(cssEditor, highlightCss, 'css');
        syncHighlight(jsEditor, highlightJs, 'javascript');
        updatePreview();
    }

    // Syntax highlighting sync
    function syncHighlight(textarea, codeEl, lang) {
        var text = textarea.value;
        // Append a newline so the highlight element stays the same height
        if (text[text.length - 1] === '\n') text += ' ';
        codeEl.textContent = text;
        codeEl.className = 'language-' + lang;
        if (window.Prism) Prism.highlightElement(codeEl);
    }

    // Scroll sync — keep the highlight overlay aligned with the textarea
    function setupScrollSync(textarea, pre) {
        textarea.addEventListener('scroll', function () {
            pre.scrollTop = textarea.scrollTop;
            pre.scrollLeft = textarea.scrollLeft;
        });
    }
    setupScrollSync(htmlEditor, highlightHtml.parentElement);
    setupScrollSync(cssEditor, highlightCss.parentElement);
    setupScrollSync(jsEditor, highlightJs.parentElement);

    // Tab switching
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var target = tab.dataset.tab;
            activeTab = target;
            tabs.forEach(function (t) { t.classList.remove('active'); });
            panes.forEach(function (p) { p.classList.remove('active'); });
            tab.classList.add('active');
            document.getElementById('pane-' + target).classList.add('active');
        });
    });

    // Update preview
    function updatePreview() {
        var html = htmlEditor.value;
        var css = cssEditor.value;
        var js = jsEditor.value;
        var doc = '<!DOCTYPE html><html><head><meta charset="utf-8">'
            + '<link rel="preconnect" href="https://fonts.googleapis.com">'
            + '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">'
            + '<style>' + css + '</style>'
            + '</head><body>' + html
            + '<scr' + 'ipt>' + js + '</scr' + 'ipt>'
            + '</body></html>';
        previewFrame.srcdoc = doc;
    }

    // Run button
    runBtn.addEventListener('click', updatePreview);

    // Auto-run on input with debounce
    var debounceTimer;
    function debounceUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 600);
    }
    htmlEditor.addEventListener('input', function () {
        syncHighlight(htmlEditor, highlightHtml, 'markup');
        debounceUpdate();
    });
    cssEditor.addEventListener('input', function () {
        syncHighlight(cssEditor, highlightCss, 'css');
        debounceUpdate();
    });
    jsEditor.addEventListener('input', function () {
        syncHighlight(jsEditor, highlightJs, 'javascript');
        debounceUpdate();
    });

    // Ctrl+Enter to run
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            updatePreview();
        }
    });

    // Tab key support in textareas
    editors.forEach(function (editor) {
        editor.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = editor.selectionStart;
                var end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 2;
                // Re-sync highlight
                if (editor === htmlEditor) syncHighlight(htmlEditor, highlightHtml, 'markup');
                else if (editor === cssEditor) syncHighlight(cssEditor, highlightCss, 'css');
                else if (editor === jsEditor) syncHighlight(jsEditor, highlightJs, 'javascript');
            }
        });
    });

    // Copy active tab code
    copyBtn.addEventListener('click', function () {
        var editor = activeTab === 'html' ? htmlEditor : activeTab === 'css' ? cssEditor : jsEditor;
        navigator.clipboard.writeText(editor.value).then(function () {
            var label = copyBtn.querySelector('.action-label');
            copyBtn.classList.add('copied');
            label.textContent = 'Copied!';
            setTimeout(function () {
                copyBtn.classList.remove('copied');
                label.textContent = 'Copy';
            }, 1500);
        });
    });

    // Reset to original effect code
    resetBtn.addEventListener('click', function () {
        loadEffect();
        var label = resetBtn.querySelector('.action-label');
        label.textContent = 'Reset!';
        setTimeout(function () { label.textContent = 'Reset'; }, 1000);
    });

    // Init: load first section + first effect
    populateEffects();
})();

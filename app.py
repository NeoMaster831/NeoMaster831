from flask import Flask, render_template

app = Flask(__name__)

with open('PGP_KEY', 'r') as f:
    pgp_key = f.read()

AWARDS = [
    {"event": "Hacktheon Sejong 2026",         "year": 2026, "rank": "2nd"},
    {"event": "CCE — Cyber Conflict Exercise", "year": 2025, "rank": "1st", "featured": True},
    {"event": "TSG CTF 2025",                  "year": 2025, "rank": "1st", "featured": True},
    {"event": "Flare-On 12",                   "year": 2025, "rank": "8th", "note": "all solved", "featured": True},
    {"event": "LA CTF 2025",                   "year": 2025, "rank": "2nd", "featured": True},
    {"event": "CCE — Cyber Conflict Exercise", "year": 2024, "rank": "1st", "featured": True},
    {"event": "CyKor CTF 2025",                "year": 2025, "rank": "1st"},
    {"event": "COSS CTF 2025",                 "year": 2025, "rank": "1st"},
    {"event": "LG U+ Security Hackathon",      "year": 2025, "rank": "2nd"},
    {"event": "YISF 2025",                     "year": 2025, "rank": "2nd"},
    {"event": "snakeCTF 2025 Finals",          "year": 2025, "rank": "8th"},
    {"event": "KOSPO CTF 2024",                "year": 2024, "rank": "1st"},
    {"event": "WhiteHat Contest 2024",         "year": 2024, "rank": "2nd"},
    {"event": "LakeCTF '24–'25 Quals",         "year": 2024, "rank": "Finalist"},
    {"event": "The Hacking Championship",      "year": 2023, "rank": "2nd"},
]

RESEARCH = [
    {
        "name": "kurasagi",
        "summary": "Windows 11 PatchGuard full bypass, proof of concept. Kernel patch "
                   "protection defeated end to end, documented as working code rather "
                   "than a write-up.",
        "period": "2024 – 2025",
        "href": "https://github.com/NeoMaster831/kurasagi",
        "link_label": "Source ↗",
    },
]

PROJECTS = [
    {
        "name": "Lorem Ipsum",
        "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do "
                   "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "period": "2025 —",
        "href": "#",
        "link_label": "Source ↗",
    },
]

WORK = [
    {
        "org": "Proven Data LLC",
        "role": "Ransomware R&D Engineer",
        "period": "Dec. 2025 —",
        "href": "https://www.provendata.com",
    },
    {
        "org": "Polybits Technologies",
        "role": "Team Lead",
        "period": "Nov. 2025 —",
        "href": "https://github.com/polybitstech",
    },
]

LINKS = [
    {"label": "Github",   "href": "https://github.com/NeoMaster831"},
    {"label": "Blog",     "href": "https://blog.wane.im"},
    {"label": "LinkedIn", "href": "https://linkedin.com/in/jong-hwi-park-6167b530a/"},
    {"label": "X",        "href": "https://x.com/willington1337"},
    {"label": "HackMD",   "href": "https://hackmd.io/@Wane"},
    {"label": "solo.to",  "href": "https://solo.to/wane"},
    {"label": "PGP",      "href": "/pgp"},
]

KICKER = "Ransomware Engineer · Reverse Engineering"
TAGLINE = "I love computer. I do computer. That's all."
COLOPHON = "Living under death."

def group_by_year(awards):
    years = sorted({a["year"] for a in awards}, reverse=True)
    return [
        {
            "year": year,
            "items": [a for a in awards if a["year"] == year],
            "has_featured": any(a.get("featured") for a in awards if a["year"] == year),
        }
        for year in years
    ]


def build_tally(awards):
    count = lambda rank: sum(1 for a in awards if a["rank"] == rank)
    firsts, seconds, thirds = count("1st"), count("2nd"), count("3rd")
    other = len(awards) - firsts - seconds - thirds

    rows = [
        {"n": firsts, "label": "First place", "gold": True},
        {"n": seconds, "label": "Second place"},
    ]
    if thirds:
        rows.append({"n": thirds, "label": "Third place"})
    if other:
        rows.append({"n": other, "label": "Finals"})
    rows.append({"n": len(awards), "label": "Total"})
    return rows


@app.route('/')
def index():
    extras = [a for a in AWARDS if not a.get("featured")]
    extra_years = sorted({a["year"] for a in extras})
    span = (
        "{} – {}".format(extra_years[0], extra_years[-1])
        if len(extra_years) > 1
        else (str(extra_years[0]) if extra_years else "")
    )
    more_label = "{} more{} ＋".format(len(extras), ", " + span if span else "")

    return render_template(
        "index.html",
        kicker=KICKER,
        tagline=TAGLINE,
        colophon=COLOPHON,
        links=LINKS,
        research=RESEARCH,
        projects=PROJECTS,
        work=WORK,
        groups=group_by_year(AWARDS),
        tally=build_tally(AWARDS),
        extra_count=len(extras),
        more_label=more_label,
    )


@app.route('/pgp')
def pgp():
    return pgp_key.replace('\n', '<br>')

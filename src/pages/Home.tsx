import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

export default function Home() {
	return (
		<>
			<Box
				component={Card}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '15px',
					padding: '20px',
					overflow: 'auto',
					width: '95%',
					minHeight: '70vh',
				}}
			>
				<Typography variant="h5">
					Welcome to Inventory Management System. Please select the
					desired page from the navbar.
				</Typography>
				<Box>
					<h1>About me:</h1>
					<Box sx={{display: "flex", gap: '10px', alignItems: "center"}}>
					<Avatar sx={{width: 128, height: 128}} alt="Rafał Myśliwczyk" src="https://avatars.githubusercontent.com/u/31518644?v=4"/>
					<h2>Hello. I'm Rafał 👋</h2>
					</Box>
					<p>
						🛠️ Fullstack Developer (Python + React + DevOps)
						<br />
						📚 Computer Science student at Warsaw University of Life
						Sciences
						<br />
						🎓 Master's degree in English Studies from SWPS
						University
						<br />
						💡 Eager to learn
						<br />
						💚 Passionate about technology
					</p>
					<p>
						<img
							src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/LinkedIn.svg"
							width="16/"
						/>
						<strong>
							<a href="https://www.linkedin.com/in/rafal-mysliwczyk-307b31120">
								LinkedIn
							</a>
						</strong>
					</p>
					<h2>💻 Techstack</h2>
					<p>These I use frequently... </p>
					<p>
						<img
							src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&amp;logo=python&amp;logoColor=ffdd54"
							alt="Python"
						/>
						<img
							src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&amp;logo=fastapi"
							alt="FastAPI"
						/>
						<img
							src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&amp;logo=typescript&amp;logoColor=white"
							alt="TypeScript"
						/>
						<img
							src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&amp;logo=react&amp;logoColor=%2361DAFB"
							alt="React"
						/>
						<img
							src="https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&amp;logo=sqlite&amp;logoColor=white"
							alt="SQLite"
						/>
						<img
							src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&amp;logo=docker&amp;logoColor=white"
							alt="Docker"
						/>
						<img
							src="https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&amp;logo=jenkins&amp;logoColor=white"
							alt="Jenkins"
						/>
						<img
							src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&amp;logo=nginx&amp;logoColor=white"
							alt="Nginx"
						/>
						<img
							src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&amp;logo=git&amp;logoColor=white"
							alt="Git"
						/>
						<img
							src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&amp;logo=linux&amp;logoColor=black"
							alt="Linux"
						/>
					</p>
					<p>
						...but that's not all. Check out my projects and let's
						talk 😎
					</p>
					<h2>💾 Projects</h2>
					<ul>
						<li>
							<a href="https://github.com/rmysliwczyk/inventory-management-system-frontend">
								Inventory Management System - Frontend
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/inventory-management-system-backend">
								Inventory Management System - Backend
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/calorie-tracker-frontend">
								Calorie Tracker - Frontend
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/calorie-tracker-backend">
								Calorie Tracker - Backend
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/markdowntohtml">
								Markdown-to-HTML
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/blocks">
								Blocks
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/pong">
								Pong
							</a>
						</li>
						<li>
							<a href="https://github.com/rmysliwczyk/snake">
								Snake
							</a>
						</li>
					</ul>

				</Box>
			</Box>
		</>
	)
}

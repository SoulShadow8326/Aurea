import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FAQS = [
	{
		q: "What is Aurea?",
		a: "Aurea is a real-time AI-powered assistant that helps artists and designers analyze and improve color palettes for accessibility and harmony. It simulates colorblindness, provides palette feedback, and offers suggestions for more inclusive design.",
	},
	{
		q: "How does Aurea help colorblind artists?",
		a: "Aurea simulates how artwork appears to people with different types of colorblindness and suggests palette adjustments to ensure the design is accessible and communicates the intended mood and meaning.",
	},
	{
		q: "What types of colorblindness can Aurea simulate?",
		a: "Aurea can simulate Protanopia, Deuteranopia, Tritanopia, and Achromatopsia, helping you see how your work appears to users with these conditions.",
	},
	{
		q: "Can I use Aurea for free?",
		a: "Yes, Aurea is free to use for analyzing images and palettes.",
	},
	{
		q: "Does Aurea store my images?",
		a: "No, Aurea does not store your images. All processing is done in real time and images are not saved.",
	},
	{
		q: "What is Gemini's role in Aurea?",
		a: "Gemini is the AI model that provides palette analysis, accessibility feedback, and creative suggestions in Aurea.",
	},
];

export default function QueriesPage() {
	const [openIndex, setOpenIndex] = useState(null);
	const navigate = useNavigate();

	return (
		<div
			className="page"
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				background: "none",
			}}
		>
			<div
				style={{
					width: 760,
					maxWidth: "99vw",
					marginTop: 56,
					background: "rgba(24,28,36,0.65)",
					borderRadius: 20,
					boxShadow: "0 8px 32px rgba(42,119,245,0.13)",
					padding: 0,
					overflow: "hidden",
					backdropFilter: "blur(8px)",
				}}
			>
				<div
					style={{
						padding: 28,
						borderBottom: "1px solid #23283a",
						background: "rgba(24,28,36,0.85)",
						fontWeight: 700,
						fontSize: 24,
						color: "#FFFFFFDD",
						textAlign: "center",
						letterSpacing: 0.5,
					}}
				>
					Frequently Asked Questions
				</div>
				<div
					style={{
						padding: 28,
						background: "rgba(26,34,54,0.85)",
						display: "flex",
						flexDirection: "column",
						gap: 18,
					}}
				>
					{FAQS.map((item, i) => (
						<div key={i} style={{ width: "100%" }}>
							<button
								onClick={() => setOpenIndex(openIndex === i ? null : i)}
								style={{
									width: "100%",
									background:
										openIndex === i
											? "#FFFFFF22"
											: "rgba(35,43,62,0.92)",
									color: openIndex === i ? "#fff" : "#fff",
									border: "none",
									borderRadius: 14,
									padding: "18px 22px",
									fontWeight: 700,
									fontSize: 18,
									textAlign: "left",
									cursor: "pointer",
									marginBottom: 4,
									transition:
										"background 0.25s cubic-bezier(.4,0,.2,1), color 0.15s",
									boxShadow:
										openIndex === i
											? "0 2px 8px #FFFFFF22"
											: "0 1px 4px #0002",
								}}
							>
								{item.q}
							</button>
							<div
								style={{
									maxHeight: openIndex === i ? 200 : 0,
									opacity: openIndex === i ? 1 : 0,
									background: "rgba(35,43,62,0.97)",
									color: "#fff",
									borderRadius: 12,
									marginTop: 2,
									marginBottom: openIndex === i ? 8 : 0,
									padding: openIndex === i ? "16px 22px" : "0 22px",
									fontSize: 16,
									fontWeight: 500,
									boxShadow: "0 1px 4px #0002",
									transition: "max-height 0.25s cubic-bezier(.4,0,.2,1), opacity 0.18s cubic-bezier(.4,0,.2,1)",
									overflow: "hidden",
								}}
							>
								{openIndex === i && item.a}
							</div>
						</div>
					))}
					<div style={{display: 'flex', justifyContent: 'center', marginTop: 32}}>
						<button
							onClick={() => navigate("/")}
							style={{
								background: "#23283a",
								color: "#fff",
								border: "none",
								borderRadius: 10,
								padding: "10px 28px",
								fontWeight: 700,
								fontSize: 16,
								cursor: "pointer",
								marginTop: 8,
								transition: "background 0.18s, color 0.18s"
							}}
						>
							Go to Home
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

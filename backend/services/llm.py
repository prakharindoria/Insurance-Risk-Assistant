from langchain_openai import ChatOpenAI
import httpx
from core.config import settings

# Initialize LangChain LLM with TCS Endpoint configuration
# We use verify=False as requested by user snippet, but keys are from environment variables
client = httpx.Client(verify=False)
llm = ChatOpenAI(
    base_url="https://genailab.tcs.in",
    model="azure/genailab-maas-gpt-4o",
    api_key=settings.OPENAI_API_KEY, # Securely fetched from environment/settings
    http_client=client,
    temperature=0.1,
)

def generate_report_content(sources_text: str, additional_context: str) -> str:
    system_prompt = """
You are an expert Insurance Underwriter Assistant.
Your task is to analyze the provided risk data (claims history, credit scores, environmental reports, market indicators) and generate a comprehensive Insurance Risk Assessment Report.

The report MUST include the following sections in a clean Markdown format:
1. Executive Summary
2. Highlights
3. Lowlights
4. Quantitative Risk Score (0-100 scale based on the data)
5. Mitigation Recommendations

Formatting requirements:
- Use markdown headings such as ## Highlights and ## Lowlights.
- Keep Highlights and Lowlights as bullet lists.
- Keep the report professional, objective, and concise.
- Use the data provided.
- Under the Quantitative Risk Score section, include one clear numeric score in the format: Score: 72/100
- Do not include any other score-like numbers in that section.
- Treat the Additional Context and User Instructions as the highest-priority guidance. If the user asks for a specific focus, concern, risk type, or preferred framing, tailor the executive summary, highlights, lowlights, mitigation recommendations, and quantitative risk score to match those instructions.
"""
    
    user_prompt = f"""
Additional Context: {additional_context}

Here is the data from the sources:
{sources_text}

Please generate the report.
"""
    try:
        # Use Langchain chat model interface
        response = llm.invoke(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.content
    except Exception as e:
        return f"Error generating report: {str(e)}\n\n(Ensure your LLM connection is configured correctly)"

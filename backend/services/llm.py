from langchain_openai import ChatOpenAI
import os
import httpx
from core.config import settings

# Initialize LangChain LLM with TCS Endpoint configuration
# We use verify=False as per the provided code snippet
client = httpx.Client(verify=False)
llm = ChatOpenAI(
    base_url="https://genailab.tcs.in",
    model="azure/genailab-maas-gpt-4o",
    api_key="sk-ZPM8Bjz6MbqU2bCEh7EjOA", # Using the provided key directly as requested, typically would use settings
    http_client=client,
    temperature=0.1,
)

def generate_report_content(sources_text: str, additional_context: str) -> str:
    system_prompt = """
You are an expert Insurance Underwriter Assistant.
Your task is to analyze the provided risk data (claims history, credit scores, environmental reports, market indicators) and generate a comprehensive Insurance Risk Assessment Report.

The report MUST include the following sections in a clean Markdown format:
1. Executive Summary
2. Quantitative Risk Score (0-100 scale based on the data)
3. Mitigation Recommendations

Maintain a professional, objective tone. Use the data provided.
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

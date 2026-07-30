from openai import OpenAI
from core.config import settings

# Since it's a TCS hosted openai 4o, you typically initialize OpenAI with an alternative base_url if needed
# We will just use the standard client for now, assuming api_key is configured properly.
client = OpenAI(api_key=settings.OPENAI_API_KEY)

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
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,
            max_tokens=1500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating report: {str(e)}\n\n(Ensure your OPENAI_API_KEY is correctly set)"

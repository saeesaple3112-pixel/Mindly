import json
import time
from openai import OpenAI


# =========================================================
# LOCAL QWEN / LLAMA SERVER
# =========================================================

LOCAL_SERVER_URL = "http://127.0.0.1:8080/v1"

client = OpenAI(
    base_url=LOCAL_SERVER_URL,
    api_key="sk-no-key-required",
)


# =========================================================
# GET MODEL
# =========================================================

def get_local_model_name():

    try:
        models = client.models.list()

        if not models.data:
            raise RuntimeError("No local model found.")

        model_name = models.data[0].id

        print("\n============================================")
        print("LOCAL QWEN MODEL DETECTED")
        print("MODEL:", model_name)
        print("SERVER:", LOCAL_SERVER_URL)
        print("============================================\n")

        return model_name

    except Exception as error:

        print("\n============================================")
        print("LOCAL QWEN CONNECTION ERROR")
        print(repr(error))
        print("============================================\n")

        raise RuntimeError(
            "Could not connect to local Qwen server."
        ) from error


# =========================================================
# KEEP NLP DATA SMALL
# =========================================================

def compact_nlp(nlp_result):

    if not isinstance(nlp_result, dict):
        return {}

    return {
        "themes": nlp_result.get("themes", [])[:4]
        if isinstance(nlp_result.get("themes"), list)
        else [],

        "symbols": nlp_result.get("symbols", [])[:4]
        if isinstance(nlp_result.get("symbols"), list)
        else [],

        "emotions": nlp_result.get("emotions", [])[:4]
        if isinstance(nlp_result.get("emotions"), list)
        else [],

        "actions": nlp_result.get("actions", [])[:4]
        if isinstance(nlp_result.get("actions"), list)
        else [],

        "narrative_pattern": nlp_result.get(
            "narrative_pattern",
            {}
        ),

        "intensity": nlp_result.get(
            "intensity",
            {}
        ),
    }


# =========================================================
# GENERATE DREAM REFLECTION
# =========================================================

def generate_dream_reflection(
    dream_text,
    nlp_result,
    selected_emotion=None,
    selected_color=None,
    intensity=None,
):

    model_name = get_local_model_name()

    # -----------------------------------------------------
    # IMPORTANT:
    # Keep prompt SMALL enough for local Qwen.
    # -----------------------------------------------------

    safe_nlp = compact_nlp(nlp_result)

    prompt = f"""
You are Mindly's AI Dream Reflection Engine.

This is exploratory reflection only.
Do not diagnose mental health conditions.
Do not predict the future.
Do not claim symbols have universal meanings.

Dream:
{dream_text[:5000]}

Selected emotion:
{selected_emotion or "Not selected"}

Selected colour:
{selected_color or "Not selected"}

Intensity:
{intensity if intensity is not None else "Not selected"}

NLP findings:
{json.dumps(safe_nlp, ensure_ascii=False)}

Give a gentle, concise reflection grounded only in the dream.

Use exactly these sections:

1. SUMMARY
2. DOMINANT THEMES
3. IMPORTANT SYMBOLS
4. EMOTIONAL PATTERN
5. POSSIBLE REFLECTIVE INTERPRETATION
6. REFLECTION QUESTION
7. GENTLE NEXT STEP

Keep the answer under 250 words.
"""


    messages = [
        {
            "role": "system",
            "content": (
                "You are Mindly's concise dream "
                "reflection assistant."
            ),
        },
        {
            "role": "user",
            "content": prompt,
        },
    ]


    # =====================================================
    # TRY QWEN 3 TIMES
    # =====================================================

    for attempt in range(1, 4):

        print("\n============================================")
        print(f"QWEN ATTEMPT {attempt}/3")
        print("MODEL:", model_name)
        print("============================================\n")

        try:

            response = client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.3,
                max_tokens=250,
                timeout=180,
            )

            if not response.choices:
                raise RuntimeError(
                    "Qwen returned no choices."
                )

            result = response.choices[0].message.content

            if result and result.strip():

                print("\n============================================")
                print("LOCAL QWEN DREAM REFLECTION SUCCESS")
                print("============================================\n")

                return result.strip()


            raise RuntimeError(
                "Qwen returned an empty response."
            )


        except Exception as error:

            print("\n============================================")
            print(
                f"QWEN CHAT ERROR — "
                f"ATTEMPT {attempt}/3"
            )
            print(repr(error))
            print("============================================\n")

            if attempt < 3:
                time.sleep(1)


    # =====================================================
    # FINAL FAILURE
    # =====================================================

    raise RuntimeError(
        "Qwen could not generate a reflection "
        "after 3 attempts."
    )

import streamlit as st
from datetime import datetime
import requests
from database.db import *  # Import the MongoDB connection function
from frontend.user import dashboard, lesson, marketplace, leaderboard, game
from frontend.user.chatbot import chatbot_ui

# ✅ Move this to the top before any other Streamlit functions
st.set_page_config(
    page_title="Cryptonian - Learn, Play, Earn",
    page_icon="🎮",
    layout="wide"
)

# Connect to MongoDB
db = connect_db()

def check_wallet_status():
    """
    Check wallet connection status from the FastAPI endpoint
    and update session state accordingly
    """
    try:
        response = requests.get("http://127.0.0.1:8000/api/wallet-status")
        if response.status_code == 200:
            data = response.json()
            st.session_state["wallet_connected"] = data.get("connected", False)
            st.session_state["wallet_address"] = data.get("wallet_address", "")
    except Exception as e:
        st.error(f"Failed to check wallet status: {str(e)}")

def save_wallet_connection(wallet_address):
    existing_user = db.users.find_one({"wallet_address": wallet_address})
    status = "Login" if existing_user else "Sign Up"
    db.users.insert_one({
        "wallet_address": wallet_address,
        "status": status,
        "timestamp": datetime.now()
    })

def disconnect_wallet_and_redirect():
    """
    Disconnect wallet and redirect to Next.js frontend using FastAPI
    """
    try:
        # Call the FastAPI endpoint to disconnect the wallet
        response = requests.post("http://127.0.0.1:8000/api/disconnect-wallet")
        
        if response.status_code == 200:
            # Clear Streamlit session state
            st.session_state["wallet_connected"] = False
            st.session_state["wallet_address"] = ""
            st.session_state["selected_page"] = "home"
            
            # Set a flag in localStorage to trigger disconnection in Next.js
            st.write(
                f"""
                <script>
                    localStorage.setItem("streamlit_disconnect", "true");
                    window.location.href = "http://localhost:3000";
                </script>
                """,
                unsafe_allow_html=True
            )
        else:
            st.error("Failed to disconnect wallet. Please try again.")
    except Exception as e:
        st.error(f"Failed to disconnect wallet: {str(e)}")

# Check for wallet address in URL parameters
def check_url_params():
    query_params = st.experimental_get_query_params()
    if "wallet" in query_params:
        wallet_address = query_params["wallet"][0]
        st.session_state["wallet_connected"] = True
        st.session_state["wallet_address"] = wallet_address
        st.session_state["selected_page"] = "dashboard"
        save_wallet_connection(wallet_address)
        # Remove the query parameter
        st.experimental_set_query_params()
        st.rerun()

# Check URL parameters on page load
if "url_params_checked" not in st.session_state:
    check_url_params()
    st.session_state["url_params_checked"] = True

# Check wallet status on page load
if "wallet_status_checked" not in st.session_state:
    check_wallet_status()
    st.session_state["wallet_status_checked"] = True

# Initialize session state for wallet connection
if "wallet_connected" not in st.session_state:
    st.session_state["wallet_connected"] = False
if "wallet_address" not in st.session_state:
    st.session_state["wallet_address"] = ""

# Sidebar navigation
st.sidebar.title("Navigation")

# Navigation options based on wallet connection status
if st.session_state["wallet_connected"]:
    wallet_address = st.session_state["wallet_address"]
    
    st.sidebar.success(f"\U0001F4B0 Connected: {wallet_address[:3]}...{wallet_address[-3:]}")
    if st.sidebar.button("\U0001F511 Logout", key="logout", help="Disconnect your wallet and return to basic features."):
        disconnect_wallet_and_redirect()
    
    pages = {
        "\U0001F4C8 Dashboard": "dashboard",
        "\U0001F4DA Lessons": "lesson",
        "\U0001F3AE Games": "game",
        "\U0001F6D2 Marketplace": "marketplace",
        "\U0001F3C6 Leaderboard": "leaderboard",
    }
    if "selected_page" not in st.session_state or st.session_state["selected_page"] == "home":
        st.session_state["selected_page"] = "dashboard"
else:
    pages = {
        "\U0001F3E0 Home": "home",
        "\U0001F4D6 About Us": "about",
    }

def navigate_to(page_name):
    st.session_state["selected_page"] = page_name
    st.rerun()

st.sidebar.markdown("### Navigation")

for label, module_name in pages.items():
    if st.sidebar.button(label, key=module_name, help=f"Go to {label}", use_container_width=True):
        navigate_to(module_name)

# Render the selected page
selected_page = st.session_state.get("selected_page", "dashboard")
if selected_page == "dashboard":
    dashboard.app(wallet_address=st.session_state["wallet_address"])
elif selected_page == "lesson":
    lesson.app(wallet_address=st.session_state["wallet_address"])
elif selected_page == "game":
    game.app(wallet_address=st.session_state["wallet_address"])
elif selected_page == "marketplace":
    marketplace.main(wallet_address=st.session_state["wallet_address"])
elif selected_page == "leaderboard":
    leaderboard.app(wallet_address=st.session_state["wallet_address"])

chatbot_ui()

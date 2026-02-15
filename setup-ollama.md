# Ollama Setup Script

If Antigravity fails to set up Ollama, run this manually in PowerShell:

```powershell
# 1. Install Ollama
winget install Ollama.Ollama

# 2. Pull the model (this might take a while)
& "C:\Users\HP OMEN 15 GAMING\AppData\Local\Programs\Ollama\ollama.exe" pull glm-5:cloud

# 3. Test it
& "C:\Users\HP OMEN 15 GAMING\AppData\Local\Programs\Ollama\ollama.exe" run glm-5:cloud "Hello"
```

# Weather Feature A/B Testing  

## Overview  
This project tests whether displaying weather information on a website improves user engagement. It uses **A/B testing** by dividing users into two groups:  

- **Group A** sees real-time weather updates.  
- **Group B** does not see any weather information.  

The goal is to analyze if the weather feature enhances user experience and interaction.  

---

## How It Works  

### 1. Assigning Users to Groups  
- When a user visits the website, they are randomly assigned to **Group A or Group B**.  
- This assignment is stored in their browser (via cookies) to keep them in the same group on future visits.  

### 2. Fetching & Displaying Weather Data  
- Users in **Group A** receive real-time weather updates, including temperature, conditions
- Users in **Group B** do not see the weather feature.  

### 3. Tracking User Interaction  
- If a user in Group A interacts with the weather feature (e.g., clicks on it), this action is recorded.  
- The collected data helps analyze whether the weather widget affects engagement.  

---

## Why This Matters  

✔ **A/B Testing:** Helps determine if weather updates improve user experience.  
✔ **Personalization:** Users in Group A get a customized experience.  
✔ **Data-Driven Decisions:** Insights help decide whether to keep, modify, or remove the feature.  

---

## Example Scenario  

Imagine you visit a travel website:  
- If you're in **Group A**, you see a weather widget displaying real-time updates.  
- If you're in **Group B**, you don’t see the widget.  

After some time, the website team will analyze:  
- Did Group A users spend more time on the site?  
- Did they interact more or book more trips?  

These insights help improve the website’s user experience.  

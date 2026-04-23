# FAQ Tool Documentation

This directory contains complete documentation for the FAQ tool implementation in the Instagram workflow.

---

## 📚 Documentation Files

### 1. **FAQ_TOOL_IMPLEMENTATION.md** ⭐ START HERE
- **Purpose:** Technical implementation details
- **Audience:** Developers, n8n administrators
- **Contents:**
  - Complete node configuration
  - Connections setup
  - Updated AI Agent prompt
  - Verification checklist
  - Database structure
  - Use cases with examples
  - Pre-deployment requirements

**Read this if:** You want technical details about how the FAQ tool was implemented.

---

### 2. **FAQ_DEPLOYMENT_CONFIRMATION.md** ✅ PROOF OF DEPLOYMENT
- **Purpose:** Official deployment confirmation and status
- **Audience:** Project managers, team leads
- **Contents:**
  - Deployment summary
  - Verification checklist (all green ✅)
  - Implementation details
  - Production status
  - Next steps
  - Comparison with reference workflow
  - File modifications/creations

**Read this if:** You need proof that FAQ tool is deployed and working.

---

### 3. **FAQ_USAGE_GUIDE.md** 👥 FOR END USERS & TESTERS
- **Purpose:** How to use the FAQ tool and expected behavior
- **Audience:** Testers, support team, content managers
- **Contents:**
  - User interaction examples
  - FAQ categories and typical questions
  - Expected AI responses
  - Database schema and sample data
  - When FAQ is triggered vs. not triggered
  - AI Agent behavior rules
  - Monitoring execution logs
  - Troubleshooting guide
  - Best practices
  - Tool node configuration reference

**Read this if:** You want to understand how users interact with FAQ or need to populate the database.

---

## 🎯 Quick Facts

| Item | Details |
|------|---------|
| **Workflow** | SobrePoxi - Instagram josue |
| **Workflow ID** | sNNzmEamKtPVMXDJ |
| **Tool Name** | consultar_faqs |
| **Tool Type** | PostgreSQL Tool |
| **Node ID** | faq-tool-instagram-001 |
| **Database Table** | knowledge_base |
| **Postgres Account ID** | vTnDtof0aB7x04sZ |
| **Status** | ✅ DEPLOYED & ACTIVE |
| **Connected Agents** | AI Agent, AI Agent1, AI Agent2 |

---

## 🚀 Getting Started

### For Administrators
1. Read: **FAQ_TOOL_IMPLEMENTATION.md** (technical setup)
2. Verify: **FAQ_DEPLOYMENT_CONFIRMATION.md** (deployment status)
3. Action: Populate `knowledge_base` table with FAQ data

### For Testers
1. Read: **FAQ_USAGE_GUIDE.md** (user interactions)
2. Test: Ask FAQ questions on Instagram DM
3. Monitor: Check n8n execution logs for `consultar_faqs` calls
4. Report: Any issues or irrelevant results

### For Content Managers
1. Read: **FAQ_USAGE_GUIDE.md** (database schema section)
2. Insert: FAQ data into `knowledge_base` table
3. Verify: Sample queries work correctly
4. Update: Regularly maintain and expand FAQ entries

---

## 📋 Database Setup Checklist

Before the FAQ tool can serve users:

- [ ] `knowledge_base` table exists in Postgres
- [ ] Table has columns: `section`, `question`, `content`
- [ ] At least 5-10 FAQ entries are populated
- [ ] Sample query tested: `consultar_faqs("terrazas")`
- [ ] Results are formatted correctly
- [ ] Postgres credentials working (ID: vTnDtof0aB7x04sZ)
- [ ] AI Agent prompt includes "consultar_faqs" in tools list

---

## ✨ What Users Experience

**User:** "¿Qué terrazas hay?"

**AI Response:** "Tenemos 3 terrazas increíbles: La Vista del Cielo (10 personas), Mirador Privado (8 personas), y Terraza Abierta (15 personas). ¿Cuál te interesa? 🌅"

**Behind the scenes:**
1. AI Agent extracts: "terrazas"
2. Calls: `consultar_faqs("terrazas")`
3. Postgres returns top 2 results
4. AI formats naturally and sends to Instagram

---

## 🔗 Related Workflows

This FAQ functionality now exists in:
- ✅ **ComoCaidoDelCieloCopia** (reference workflow)
- ✅ **SobrePoxi - Instagram josue** (now updated with same capability)

Both use the same `knowledge_base` table and Postgres credentials.

---

## 🐛 Troubleshooting Reference

| Issue | Solution |
|-------|----------|
| FAQ returns no results | Check `knowledge_base` table has data |
| AI not using FAQ tool | Verify prompt includes tool in available list |
| Irrelevant results | Expand FAQ database with more entries |
| Tool not executing | Check Postgres credentials are valid |
| Connection failed | Verify n8n workflow is ACTIVE |

See **FAQ_USAGE_GUIDE.md** for detailed troubleshooting.

---

## 📞 Support

For questions or issues:

1. **Technical:** Check FAQ_TOOL_IMPLEMENTATION.md
2. **Deployment:** Check FAQ_DEPLOYMENT_CONFIRMATION.md  
3. **Usage:** Check FAQ_USAGE_GUIDE.md
4. **Database:** Contact database administrator
5. **n8n:** Check execution logs in workflow

---

## 📝 Version Information

- **Implementation Date:** 2025-01-30
- **Version:** 1.0 (Initial deployment)
- **Status:** Production ✅
- **Last Updated:** 2025-01-30

---

**FAQ Tool Successfully Deployed! 🎉**

# Supabase Migration Guide for CollabSphere

## Step 1: Get Your Supabase Connection String

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings → Database → Connection String**
4. Choose **PostgreSQL** tab
5. Copy the connection string (it looks like):
   ```
   postgresql://postgres.[PROJECT-ID]:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
   ```

## Step 2: Configure Your Environment

1. Open `backend/.env`:
   ```bash
   cd backend
   ```

2. Update the DATABASE_URL with your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres.csvlvzkucubqlfnuuizk:YOUR_PASSWORD@db.csvlvzkucubqlfnuuizk.supabase.co:5432/postgres
   ```

## Step 3: Install Required Package

Your `requirements.txt` already has `asyncpg`, but verify:

```bash
pip install -r requirements.txt
```

## Step 4: Run Database Migration

```bash
# Navigate to backend directory
cd backend

# Run the migration script
python supabase_migration.py
```

The script will:
- Connect to your Supabase PostgreSQL database
- Create all 18 tables based on your models
- Verify tables were created
- Print a list of created tables

## Step 5: Verify in Supabase Console

1. Go to Supabase Dashboard
2. Click **SQL Editor** on the left
3. Run:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```
4. You should see all your tables listed

## Environment Variable Format

### For Supabase:
```env
DATABASE_URL=postgresql://postgres.[PROJECT-ID]:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_KEY=your_anon_key_here
```

### For Local Development:
```env
DATABASE_URL=postgresql://collabsphere:collabsphere_password@localhost:5432/collabsphere_db
```

## Database Models Created

Your migration will create these 18 tables across 6 clusters:

**Cluster 1: System Identity (5 tables)**
- roles
- departments
- users
- system_settings
- audit_logs

**Cluster 2: Academic Management (4 tables)**
- semesters
- subjects
- syllabuses
- academic_classes
- class_enrollments

**Cluster 3: Project Formation (4 tables)**
- topics
- projects
- teams
- team_members

**Cluster 4: Agile Collaboration (4 tables)**
- sprints
- tasks
- meetings
- channels
- messages

**Cluster 5: Milestones & Submissions (3 tables)**
- milestones
- checkpoints
- submissions

**Cluster 6: Evaluation & Resources (5 tables)**
- evaluation_criteria
- evaluations
- evaluation_details
- peer_reviews
- mentoring_logs
- resources

## Troubleshooting

### Connection Refused
- ✅ Verify DATABASE_URL is correct
- ✅ Check your Supabase project is active
- ✅ Ensure firewall allows PostgreSQL connections

### Authentication Failed
- ✅ Double-check password in connection string
- ✅ Regenerate database password if needed (Settings > Database)

### Permission Denied
- ✅ Use `postgres` user (default role)
- ✅ Ensure role has `CREATEDB` permission

### SSL Certificate Error
Connection string includes SSL by default. If you get SSL errors:
```python
# In supabase_migration.py, modify engine creation:
engine = create_async_engine(
    database_url,
    echo=True,
    pool_pre_ping=True,
    connect_args={"ssl": False}  # Add this
)
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to git - add to `.gitignore`
- Regenerate API keys after sharing them
- Use environment variables in production
- Rotate database passwords regularly

## Next Steps

After successful migration:
1. Update your Docker Compose to use Supabase (optional)
2. Test API endpoints with new database
3. Set up automated backups in Supabase
4. Configure Row Level Security (RLS) policies in Supabase if needed

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [SQLAlchemy + PostgreSQL](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html)

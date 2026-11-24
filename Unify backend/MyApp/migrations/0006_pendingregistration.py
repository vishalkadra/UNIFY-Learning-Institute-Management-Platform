from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("MyApp", "0005_alter_course_id_alter_coursemodule_id_and_more")]

    operations = [
        migrations.CreateModel(
            name="PendingRegistration",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("first_name", models.CharField(blank=True, max_length=150)),
                ("last_name", models.CharField(blank=True, max_length=150)),
                ("password_hash", models.CharField(max_length=128)),
                ("code_hash", models.CharField(max_length=64)),
                ("created_at", models.DateTimeField(auto_now=True)),
                ("expires_at", models.DateTimeField()),
                ("attempts", models.PositiveSmallIntegerField(default=0)),
                ("is_used", models.BooleanField(default=False)),
            ],
        ),
    ]

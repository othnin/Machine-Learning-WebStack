# Generated by Django 5.0.4 on 2024-07-22 19:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('endpoints', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mlalgorithmstatus',
            name='status',
            field=models.CharField(choices=[('T', 'Testing'), ('S', 'Staging'), ('P', 'Production'), ('A', 'Ab Testing')], max_length=1),
        ),
    ]

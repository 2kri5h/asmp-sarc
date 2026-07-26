#!/bin/bash
# add execute rights
# chmod +x ./wsgi-entrypoint.sh
# Run the above command in production to give execution rights to the wsgi-entrypoint.sh file

# until cd ./Yearbook23
# do
#     echo "Waiting for server volume... Nikhil in SARC Web Team is working on it😎"
# done

# until poetry run python manage.py makemigrations
# do
#     echo "Waiting for database migration... Nikhil in SARC Web Team is working on it😎"
#     sleep 2
# done

# until poetry run python manage.py migrate
# do
#     echo "Waiting for database to be ready... Nikhil in SARC Web Team is working on it😎"
#     sleep 2
# done

poetry run python manage.py makemigrations 
# poetry run python manage.py makemigrations Authentication
# poetry run python manage.py makemigrations Cors
# poetry run python manage.py makemigrations Comments
# poetry run python manage.py makemigrations Posts
# poetry run python manage.py makemigrations Impressions
# poetry run python manage.py makemigrations MailApp
# poetry run python manage.py makemigrations Notifications
# poetry run python manage.py makemigrations Polls
# poetry run python manage.py makemigrations Search
# poetry run python manage.py makemigrations SortAndFilter

poetry run python manage.py migrate
# poetry run python manage.py migrate Authentication
# poetry run python manage.py migrate Cors
# poetry run python manage.py migrate Comments
# poetry run python manage.py migrate Posts
# poetry run python manage.py migrate Impressions
# poetry run python manage.py migrate MailApp
# poetry run python manage.py migrate Notifications
# poetry run python manage.py migrate Polls
# poetry run python manage.py migrate Search
# poetry run python manage.py migrate SortAndFilter
poetry run python manage.py makemigrations asmp_reg




# for elastic server
# poetry run python manage.py search_index --rebuild

poetry run python manage.py collectstatic --noinput
poetry run python manage.py runserver 0.0.0.0:8000
# CMD ["poetry", "run", "python", "manage.py", "collectstatic", "--noinput"]
# CMD ["poetry", "run", "gunicorn", "Yearbook23.wsgi", "--bind", "0.0.0.0:8000"]
# Since we have 4vCPU on server, change workers and threads to 8 in actual production

#####################################################################################
# Options to DEBUG Django server
# Optional commands to replace abouve gunicorn command

# Option 1:
# run gunicorn with debug log level
# gunicorn server.wsgi --bind 0.0.0.0:8000 --workers 1 --threads 1 --log-level debug

# Option 2:
# run development server
# DEBUG=True ./manage.py runserver 0.0.0.0:8000

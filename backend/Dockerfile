FROM python:3.11

# Prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /ASMP23/

# Install Poetry
RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry config virtualenvs.create false

# Copy pyproject and install deps
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-root

RUN pip install django django-cors-headers

# Copy entrypoint and project files
COPY wsgi-entrypoint.sh ./
RUN chmod +x wsgi-entrypoint.sh
COPY . ./

# Set default command
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]

# API-chainer

## Overview

The **Workflow Engine** is a backend system designed to allow administrators to visually design API request workflows and execute them via a generated API endpoint. Using a **drag-and-drop UI**, users can chain multiple API requests, configure conditions, and manage request flows. This project leverages **Node-RED** for backend execution and **React Flow** for frontend design.

## Features

- **API Configurator**: Dynamically configure HTTP requests, headers, request bodies, and responses.
- **Flow Control**: Chain API requests and handle conditional logic based on response data.
- **Drag-and-Drop UI**: Easily design API request flows with a graphical interface.
- **Endpoint Generation**: Generate a unique API endpoint that triggers the designed workflow.
- **Logging & Debugging**: Track and debug workflow executions with detailed logs.

## Installation

### Prerequisites

- Node.js (version 16.x or higher)
- npm (Node Package Manager)
- MongoDB

### 1. Clone the repository

```bash
git clone https://github.com/geekobueno/API-chainer
cd API-chainer

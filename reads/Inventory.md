# Inventory Management

## Overview

Inventory management handles stock, transactions, adjustments, orders, and requests. It supports automatic reordering and integrates with sample/billing workflows.

## Features

- Stock management and transactions
- Inventory adjustments
- Orders and order requests
- Product catalog
- Inventory KPIs and CSV export (v0.2.3+)

## Architecture

- **Entities**: `beak/modules/core/inventory/` — Stock, Product, Transaction, Order, etc.
- **GraphQL**: `beak/api/gql/inventory/` — Queries and mutations

## Integration

- Cost display on sample registration form with billing module integration
- Department filters applied across inventory views

Knowledge Data Design

# Overview

This document outlines the way the system stores knowledge.
These documents will be stored

# Knowledge Gathering Process

In the application we want a few different ways to generate knowledge.

When we feed in a knowledge source it will store it as a version.

## Types

#### Notes

You should be able to just create plain text notes.

#### URL

You should be able to pass through a url and it will generate content from it.

#### JIRA

Integration into JIRA where you can have it generate knowledge from crawling jira sites

#### Files

You should be able to give it any sort of file and it will turn that into knowledge.

## Versioning

When we feed in a knowledge source it will create a new version.
The idea is that you can look at a source and see the changes over time.

## Other Ideas

### Local Watcher

We should be able to allow the user to watch a local directory and when any files in there change it would update the sources.

# Database Design

All tables will have the following:
id: UUID
active: boolean
created_at: datetime
modified_at: datetime
created_by: UUID
modified_by: UUID

### users

name: string
description: string

### source_collections

This will store a collection of sources.
While in the application you will be able to set your current 'collection' that your working from.

name: string
location: string
description: string

### source_types

This is the different types of the source. This will be used to determine how the source should be processed/handled.

name: string;
code: string; // Examples WEB, AUDIO, PDF, WORD, CSV, TXT
description: string

### sources

This contains the individual source.

source_colllection_id: UUID
name: string
description: string
uri: string; // This is basically the identifier for the source record. It could be a url, file hash, file name etc...
source_type: UUID
metadata: JSONB // Any metadata
tags: string[] // Tags that relate to this source.

### source_version

source_id: string;
version_number: number

### source_part

When we create a source we will split it into smaller parts for RAG.

source_version_id: UUID // Parent record
summary: string
content: string
tags: string[] // Assorted tags that relate to this source part.

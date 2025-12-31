# Firestore Indexes Configuration

This document explains the Firestore indexes configured for optimal performance with large datasets.

## Indexes Defined

The `firestore.indexes.json` file contains the following indexes:

### 1. Posts Collection - CreatedAt Descending
**Purpose**: Fast sorting of posts by creation date (most recent first)
- **Collection**: `posts`
- **Fields**: `createdAt` (DESCENDING)
- **Used by**: Dashboard screen for displaying posts in chronological order

### 2. Posts Collection - Language + CreatedAt Composite
**Purpose**: Efficient filtering and sorting by language (for future language-based queries)
- **Collection**: `posts`
- **Fields**: `language` (ASCENDING), `createdAt` (DESCENDING)
- **Used by**: Potential future optimization for language-prioritized queries

### 3. Posts Collection - AuthorId + CreatedAt Composite
**Purpose**: Efficient querying of posts by author
- **Collection**: `posts`
- **Fields**: `authorId` (ASCENDING), `createdAt` (DESCENDING)
- **Used by**: Potential user profile pages or author-specific queries

### 4. Comments Subcollection - CreatedAt Ascending
**Purpose**: Fast sorting of comments chronologically
- **Collection**: `comments` (subcollection of `posts/{postId}/comments`)
- **Fields**: `createdAt` (ASCENDING)
- **Used by**: Details screen for displaying comments in order

### 5. Comments Subcollection - CreatedAt Descending
**Purpose**: Fast sorting of comments in reverse chronological order
- **Collection**: `comments` (subcollection of `posts/{postId}/comments`)
- **Fields**: `createdAt` (DESCENDING)
- **Used by**: Potential future feature for reverse chronological comments

## About postId Indexing

**Note**: `postId` is the document ID in Firestore, which is **automatically indexed** by Firebase. No manual index is required for document IDs. You can directly access documents using `doc(db, 'posts', postId)` without any additional indexing.

## Deploying Indexes

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Choose to use the existing `firestore.indexes.json` file

4. **Deploy the indexes**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Option 2: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `saibaba-community`
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"** for each index defined in `firestore.indexes.json`
5. Manually create each composite index with the fields specified above

### Option 3: Automatic Creation (Development)

Firebase will automatically prompt you to create indexes when you run a query that requires one. You'll see an error message with a link to create the index directly in the Firebase Console.

**Note**: Index creation can take several minutes for large collections. The indexes will be created in the background and become active once ready.

## Monitoring Index Status

1. Go to Firebase Console → Firestore Database → Indexes
2. Check the status of each index:
   - **Building**: Index is being created (may take a few minutes)
   - **Enabled**: Index is ready to use
   - **Error**: Check the error message and fix any issues

## Best Practices

1. **Start with simple indexes**: The `createdAt` index is essential for basic sorting
2. **Add composite indexes as needed**: Only create composite indexes when you implement queries that need them
3. **Monitor query performance**: Use Firebase Console to check query performance and identify slow queries
4. **Index size**: Be aware that indexes take up storage space. Monitor your Firestore usage

## Current Query Patterns

Based on the current codebase:

- ✅ **Dashboard Screen**: Uses `orderBy('createdAt', 'desc')` - requires index #1
- ✅ **Details Screen Comments**: Uses `orderBy('createdAt', 'asc')` - requires index #4
- ⚠️ **Language Filtering**: Currently done client-side. Index #2 would optimize this if implemented server-side

## Troubleshooting

If you see an error like "The query requires an index":
1. Click the error link in the console to create the index automatically
2. Or manually create it using one of the methods above
3. Wait for the index to build (usually 1-5 minutes)

For more information, see the [Firebase Documentation on Indexes](https://firebase.google.com/docs/firestore/query-data/indexing).


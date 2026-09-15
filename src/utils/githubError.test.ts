import { describe, expect, it } from 'vitest'

import { GitHubApiError } from '../api/github'
import { getGitHubErrorMessage } from './githubError'

describe('getGitHubErrorMessage', () => {
  it('returns a repository not found message for 404 errors', () => {
    const error = new GitHubApiError(
      'Repository not found.',
      404,
    )
  
    expect(getGitHubErrorMessage(error)).toBe(
      'Repository not found.',
    )
  })

  it('returns a rate limit message with reset time', () => {
    const error = new GitHubApiError(
      'GitHub API rate limit reached.',
      403,
      1893456000,
    )
  
    const message = getGitHubErrorMessage(error)
  
    expect(message).toContain(
      'GitHub API rate limit reached.',
    )
  
    expect(message).toContain(
      'Please try again after',
    )
  })

  it('returns a network error message for TypeError', () => {
    const error = new TypeError('Failed to fetch')

    expect(getGitHubErrorMessage(error)).toBe(
      'Unable to connect to GitHub. Please check your internet connection and try again.',
    )
  })

  it('returns a fallback message for unknown errors', () => {
    expect(getGitHubErrorMessage('unknown')).toBe(
      'Something went wrong. Please try again.',
    )
  })
})
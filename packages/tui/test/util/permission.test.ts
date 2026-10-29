import { expect, test } from "bun:test"
import { permissionPresentation } from "../../src/util/permission"

test("preserves permission roots and self-contained metadata", () => {
  expect(permissionPresentation({ action: "external_directory", resources: ["/*"] }).title).toBe(
    "Access external directory /",
  )
  expect(permissionPresentation({ action: "external_directory", resources: ["C:/*"] }).title).toBe(
    "Access external directory C:/",
  )
  expect(
    permissionPresentation({ action: "webfetch", resources: [], metadata: { url: "https://example.com" } }),
  ).toMatchObject({
    title: "WebFetch https://example.com",
    lines: ["URL: https://example.com"],
  })
  expect(permissionPresentation({ action: "websearch", resources: [], metadata: { query: "releases" } })).toMatchObject(
    {
      title: 'Web Search "releases"',
      lines: ["Query: releases"],
    },
  )
})

test("shows the arguments of other tools", () => {
  expect(
    permissionPresentation({
      action: "linear_save_comment",
      resources: ["*"],
      metadata: { input: { issueId: "ENG-1", body: "Looks good", draft: false } },
    }),
  ).toMatchObject({
    title: "Call tool linear_save_comment",
    lines: ["Tool: linear_save_comment", "issueId: ENG-1", "body: Looks good", "draft: false"],
  })
  expect(
    permissionPresentation({
      action: "gateway_call_tool",
      resources: ["*"],
      input: { name: "save_comment", arguments: { issueId: "ENG-1" } },
    }).lines,
  ).toEqual(["Tool: gateway_call_tool", "name: save_comment", 'arguments: {"issueId":"ENG-1"}'])
  expect(permissionPresentation({ action: "custom_tool", resources: ["*"] }).lines).toEqual(["Tool: custom_tool"])
})

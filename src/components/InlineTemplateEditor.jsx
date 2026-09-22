import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { parseSegments } from '../lib/templateParser'

function createChipElement(variable) {
  const chip = document.createElement('span')
  chip.contentEditable = 'false'
  chip.dataset.key = variable.key
  chip.className =
    'inline rounded-md bg-brand-500/20 px-1.5 py-0.5 text-brand-400 font-medium select-none'
  chip.textContent = `{${variable.label}}`
  return chip
}

function buildDom(container, body, variables) {
  container.innerHTML = ''
  const segments = parseSegments(body, variables)
  segments.forEach((segment) => {
    if (segment.type === 'text') {
      container.appendChild(document.createTextNode(segment.value))
    } else {
      container.appendChild(createChipElement(segment.variable))
    }
  })
  if (segments.length > 0 && segments[segments.length - 1].type === 'variable') {
    container.appendChild(document.createTextNode(''))
  }
}

function serializeDom(container) {
  let out = ''
  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent
    } else if (node.nodeType === Node.ELEMENT_NODE && node.dataset.key) {
      out += `{{${node.dataset.key}}}`
    }
  })
  return out
}

// contentEditable surface that renders {{key}} tokens as inline, non-editable
// chips (matching the Figma editor) while keeping `body` as the source of truth.
export const InlineTemplateEditor = forwardRef(function InlineTemplateEditor(
  { body, variables, onChange, onSelectText, onEscape, placeholder },
  ref,
) {
  const containerRef = useRef(null)
  const skipNextSync = useRef(false)

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    if (containerRef.current) buildDom(containerRef.current, body, variables)
  }, [body, variables])

  function insertChip(range, variable) {
    const container = containerRef.current
    if (!container) return
    range.deleteContents()
    const chip = createChipElement(variable)
    range.insertNode(chip)

    const after = document.createTextNode('')
    chip.after(after)
    const sel = window.getSelection()
    const newRange = document.createRange()
    newRange.setStart(after, 0)
    newRange.collapse(true)
    sel.removeAllRanges()
    sel.addRange(newRange)

    skipNextSync.current = true
    onChange(serializeDom(container))
  }

  useImperativeHandle(ref, () => ({
    insertChipAtRange(range, variable) {
      insertChip(range, variable)
    },
    insertChipAtEnd(variable) {
      const container = containerRef.current
      if (!container) return
      const range = document.createRange()
      range.selectNodeContents(container)
      range.collapse(false)
      insertChip(range, variable)
    },
  }))

  function handleInput() {
    skipNextSync.current = true
    onChange(serializeDom(containerRef.current))
  }

  function handleSelectionChange() {
    const sel = window.getSelection()
    const container = containerRef.current
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !container) {
      onSelectText(null)
      return
    }
    const range = sel.getRangeAt(0)
    if (!container.contains(range.commonAncestorContainer)) {
      onSelectText(null)
      return
    }
    const text = sel.toString()
    if (!text.trim()) {
      onSelectText(null)
      return
    }
    onSelectText({ range: range.cloneRange(), text })
  }

  return (
    <div
      ref={containerRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onMouseUp={handleSelectionChange}
      onKeyUp={handleSelectionChange}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onEscape?.()
      }}
      data-placeholder={placeholder}
      className="min-h-[200px] whitespace-pre-wrap rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 leading-relaxed text-ink-50 outline-none focus:border-brand-500 empty:before:text-ink-500 empty:before:content-[attr(data-placeholder)]"
    />
  )
})

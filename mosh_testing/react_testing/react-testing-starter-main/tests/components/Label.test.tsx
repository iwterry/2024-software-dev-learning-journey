import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe('Label', () => {
  const renderLabel = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    )
  }

  it.each([
    { labelId: 'welcome', language: 'en', expectedText: 'Welcome' },
    { labelId: 'new_product', language: 'en', expectedText: 'New Product' },
    { labelId: 'edit_product', language: 'en', expectedText: 'Edit Product' },
    { labelId: 'welcome', language: 'es', expectedText: 'Bienvenidos' },
    { labelId: 'new_product', language: 'es', expectedText: 'Nuevo Producto' },
    { labelId: 'edit_product', language: 'es', expectedText: 'Editar Producto' },
  ])('should render $expectedText for the labelId $labelId in the language $language', ({ labelId, language, expectedText }) => {
    renderLabel(labelId,  language as Language);
    const text = screen.getByText(expectedText);
    expect(text).toBeInTheDocument();
  })
  
  it('should throw an error with not found message when given invalid labelId', () => {
    const invalidLabelId = 'invalid_label_id';
    const language: Language = 'en';

    expect(
      () => renderLabel(invalidLabelId, language)
    ).toThrowError(/not found/i);
  })
})

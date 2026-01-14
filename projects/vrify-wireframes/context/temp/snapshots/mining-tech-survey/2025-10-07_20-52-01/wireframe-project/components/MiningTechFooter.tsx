export const WireframeFooter = () => {
  return (
    <footer className="py-12 bg-wireframe-50 border-t border-border">
      <div className="wireframe-container">
        <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact</span>
          <span>About</span>
        </div>
        <div className="text-center mt-6 text-xs text-annotation">
          Analytics placeholders: page_view, cta_click, form_submit, pdf_download
        </div>
      </div>
    </footer>
  );
};
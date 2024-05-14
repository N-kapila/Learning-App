import PropTypes from "prop-types";
import EditorToolbarStyle from "./EditorToolbarStyle";

// ----------------------------------------------------------------------

const HEADINGS = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
];

export const formats = [
  "align",
  "background",
  "blockquote",
  "bold",
  "bullet",
  "code",
  "code-block",
  "color",
  "direction",
  "font",
  "formula",
  "header",
  "image",
  "indent",
  "italic",
  "link",
  "list",
  "script",
  "size",
  "strike",
  "table",
  "underline",
  "video",
];

EditorToolbar.propTypes = {
  id: PropTypes.string.isRequired,
  isSimple: PropTypes.bool,
  list: PropTypes.bool,
  superAndSub: PropTypes.bool,
  directions: PropTypes.bool,
  multiFormats: PropTypes.bool,
  indent: PropTypes.bool,
  color: PropTypes.bool,
};

export default function EditorToolbar({
  id,
  isSimple,
  list,
  superAndSub,
  directions,
  multiFormats,
  indent,
  color,
  ...other
}) {
  return (
    <EditorToolbarStyle {...other}>
      <div id={id}>
        <div className="ql-formats">
          <select className="ql-header" defaultValue="">
            {HEADINGS.map((heading, index) => (
              <option key={heading} value={index + 1}>
                {heading}
              </option>
            ))}
            <option value="">Normal</option>
          </select>
        </div>

        <div className="ql-formats">
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-italic" />
          <button type="button" className="ql-underline" />
          <button type="button" className="ql-strike" />
        </div>

        {color && (
          <div className="ql-formats">
            <select className="ql-color" />
            <select className="ql-background" />
          </div>
        )}

        <div className="ql-formats">
          {list && <button type="button" className="ql-list" value="ordered" />}
          {list && <button type="button" className="ql-list" value="bullet" />}
          {indent && <button type="button" className="ql-indent" value="-1" />}
          {indent && <button type="button" className="ql-indent" value="+1" />}
        </div>

        <div className="ql-formats">
          {superAndSub && (
            <button type="button" className="ql-script" value="super" />
          )}
          {superAndSub && (
            <button type="button" className="ql-script" value="sub" />
          )}
        </div>

        {isSimple && (
          <div className="ql-formats">
            <button type="button" className="ql-code-block" />
            <button type="button" className="ql-blockquote" />
          </div>
        )}

        {directions && (
          <div className="ql-formats">
            <button type="button" className="ql-direction" value="rtl" />
            <select className="ql-align" />
          </div>
        )}

        <button type="button" className="ql-link" />

        {multiFormats && (
          <div className="ql-formats">
            <button type="button" className="ql-image" />
            <button type="button" className="ql-video" />
          </div>
        )}

        <div className="ql-formats">
          {isSimple && <button type="button" className="ql-formula" />}
          <button type="button" className="ql-clean" />
        </div>
      </div>
    </EditorToolbarStyle>
  );
}

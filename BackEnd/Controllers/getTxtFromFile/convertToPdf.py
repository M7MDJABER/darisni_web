from pylovepdf.ilovepdf import ILovePdf
import sys
import os

PUBLIC_KEY = "project_public_c1520dea809128b7c53f1742b65db684_0ikIu569f02ca2d120635e7548b852d7e542c"  # استبدله بمفتاحك

def convert_to_pdf(file_path):
    try:
        ilovepdf = ILovePdf(PUBLIC_KEY, verify_ssl=True)

        ext = os.path.splitext(file_path)[1].lower()
        if ext not in ['.doc', '.docx', '.ppt', '.pptx']:
            raise Exception("Unsupported file type")

        # استخدم "officepdf" لكل من Word و PowerPoint
        task = ilovepdf.new_task('officepdf')

        task.add_file(file_path)
        task.execute()
        task.download(os.path.dirname(file_path))

        output_pdf_path = os.path.splitext(file_path)[0] + ".pdf"
        print(output_pdf_path)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    input_path = sys.argv[1]
    convert_to_pdf(input_path)
